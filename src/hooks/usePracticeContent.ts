import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  PartialQuestion, 
  UserQuestionProgress
} from '@/lib/models/question';
import { 
  PartialPassage, 
  UserPassageProgress 
} from '@/lib/models/passage';
import { questionService } from '@/lib/services/questionService';
import { passageService } from '@/lib/services/passageService';
import { practiceService } from '@/lib/services/practiceService';

interface PracticeFilters {
  difficulty: string;
  type: string;
  showNew: boolean;
  page: number;
}

export function usePracticeContent() {
  const [questions, setQuestions] = useState<PartialQuestion[]>([]);
  const [passages, setPassages] = useState<PartialPassage[]>([]);
  const [questionProgress, setQuestionProgress] = useState<Record<string, UserQuestionProgress>>({});
  const [passageProgress, setPassageProgress] = useState<Record<string, UserPassageProgress>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  
  // Use ref for cursors to avoid triggering re-renders
  const cursorsRef = useRef<{passageCursor?: string; questionCursor?: string}>({});
  // Track the cursors used to fetch the CURRENT page (for going back)
  const currentPageStartCursors = useRef<{passageCursor?: string; questionCursor?: string}>({});
  const [hasMore, setHasMore] = useState(false);
  const [pageHistory, setPageHistory] = useState<Array<{passageCursor?: string; questionCursor?: string}>>([]);

  // Initialize filters from sessionStorage
  const getInitialFilters = (): PracticeFilters => {
    const savedFilters = sessionStorage.getItem('practiceFilters');
    if (savedFilters) {
      try {
        return JSON.parse(savedFilters);
      } catch (err) {
        console.error('Failed to restore filters:', err);
      }
    }
    return { difficulty: 'all', type: 'all', showNew: false, page: 1 };
  };

  const initialFilters = getInitialFilters();
  const [page, setPage] = useState(initialFilters.page);
  const [difficultyFilter, setDifficultyFilter] = useState(initialFilters.difficulty);
  const [typeFilter, setTypeFilter] = useState(initialFilters.type);
  const [showNew, setShowNew] = useState(initialFilters.showNew);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const baseParams: {
        page: number;
        limit: number;
        difficulty?: string;
        new?: boolean;
      } = { page, limit: 20 };
      
      if (difficultyFilter !== 'all') baseParams.difficulty = difficultyFilter;
      if (showNew) baseParams.new = true;

      let fetchedQuestions: PartialQuestion[] = [];
      let fetchedPassages: PartialPassage[] = [];

      if (typeFilter === 'reading_comprehension') {
        const response = await passageService.getPassages(baseParams);
        fetchedPassages = response?.passages || [];
        fetchedQuestions = [];
        setTotalPages(Math.ceil((response?.total || 0) / 20));
      } else if (typeFilter === 'all') {
        // Cursor-based pagination for mixed content using lazy iterators
        // Save the cursors we're ABOUT to use (for going back to this page later)
        currentPageStartCursors.current = {...cursorsRef.current};
        
        const response = await practiceService.getMixedPracticeContent({
          passageCursor: cursorsRef.current.passageCursor,
          questionCursor: cursorsRef.current.questionCursor,
          difficulty_level: difficultyFilter !== 'all' ? difficultyFilter : undefined,
          new: showNew || undefined,
          limit: 20,
        });
        fetchedPassages = response?.passages || [];
        fetchedQuestions = response?.questions || [];
        
        // Store the new cursors for next page (using ref to avoid re-render)
        cursorsRef.current = {
          passageCursor: response?.passageCursor,
          questionCursor: response?.questionCursor
        };
        setHasMore(response?.hasMore || false);
        
        // Calculate totalPages from the total counts
        const totalItems = (response?.passageTotal || 0) + (response?.questionTotal || 0);
        const calculatedPages = Math.ceil(totalItems / 20);
        setTotalPages(calculatedPages || 1);
      } else {
        // Map frontend filter values to backend question types
        let questionType = typeFilter;
        if (typeFilter === 'text_completion') {
          questionType = 'text_completion_single,text_completion_double,text_completion_triple';
        }
        
        const response = await questionService.getQuestions({ ...baseParams, type: questionType });
        console.log('[Text Completion Filter] Response:', {
          typeFilter,
          questionType,
          questionsCount: response?.questions?.length,
          total: response?.total,
          firstQuestion: response?.questions?.[0]
        });
        fetchedQuestions = response?.questions || [];
        fetchedPassages = [];
        setTotalPages(Math.ceil((response?.total || 0) / 20));
      }

      setPassages(fetchedPassages);
      setQuestions(fetchedQuestions);
      
      // Fetch progress data
      try {
        const questionIds = fetchedQuestions.map(q => q.id);
        const passageIds = fetchedPassages.map(p => p.id);
        
        const [qProgress, pProgress] = await Promise.all([
          questionIds.length > 0 ? questionService.getBulkQuestionProgress(questionIds) : Promise.resolve({}),
          passageIds.length > 0 ? passageService.getBulkPassageProgress(passageIds) : Promise.resolve({})
        ]);
        
        setQuestionProgress(qProgress);
        setPassageProgress(pProgress);
      } catch (progressErr) {
        console.error('Failed to fetch progress:', progressErr);
      }
    } catch (err) {
      setError('Failed to load content. Please try again.');
      console.error('Error fetching data:', err);
      setQuestions([]);
      setPassages([]);
    } finally {
      setLoading(false);
    }
  }, [page, difficultyFilter, typeFilter, showNew]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleDifficultyChange = (value: string) => {
    setDifficultyFilter(value);
    setPage(1);
    cursorsRef.current = {}; // Reset cursors
    currentPageStartCursors.current = {}; // Reset start cursors
    setPageHistory([]); // Clear history
    // Clear practice service cache when filters change
    practiceService.clearCache();
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setPage(1);
    cursorsRef.current = {}; // Reset cursors
    currentPageStartCursors.current = {}; // Reset start cursors
    setPageHistory([]); // Clear history
    // Clear practice service cache when filters change
    practiceService.clearCache();
  };

  const handleShowNewToggle = () => {
    setShowNew(!showNew);
    setPage(1);
    cursorsRef.current = {}; // Reset cursors
    currentPageStartCursors.current = {}; // Reset start cursors
    setPageHistory([]); // Clear history
    // Clear practice service cache when filters change
    practiceService.clearCache();
  };
  
  const handlePageChange = (newPage: number) => {
    if (typeFilter === 'all') {
      // Cursor-based pagination for mixed content
      if (newPage > page) {
        // Going forward
        if (hasMore) {
          // Save the cursors used to fetch THIS page so we can come back to it
          setPageHistory(prev => [...prev, {...currentPageStartCursors.current}]);
          setPage(newPage);
          // cursorsRef.current already has the next page's cursors
        }
      } else if (newPage < page) {
        // Going backward
        const newHistory = [...pageHistory];
        const previousPageStartCursors = newHistory.pop();
        setPageHistory(newHistory);
        // Restore cursors to refetch the previous page
        cursorsRef.current = previousPageStartCursors || {};
        currentPageStartCursors.current = previousPageStartCursors || {};
        setPage(newPage);
      }
    } else {
      // Page-based pagination for other types
      setPage(newPage);
    }
  };

  const saveFiltersToSession = () => {
    sessionStorage.setItem('practiceFilters', JSON.stringify({
      difficulty: difficultyFilter,
      type: typeFilter,
      showNew,
      page,
    }));
  };

  return {
    questions,
    passages,
    questionProgress,
    passageProgress,
    loading,
    error,
    page,
    totalPages,
    difficultyFilter,
    typeFilter,
    showNew,
    setPage: handlePageChange,
    handleDifficultyChange,
    handleTypeChange,
    handleShowNewToggle,
    fetchQuestions,
    saveFiltersToSession,
  };
}
