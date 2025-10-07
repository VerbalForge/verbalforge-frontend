'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { QuestionCard } from '@/components/QuestionCard';
import { PassageCard } from '@/components/PassageCard';
import { apiService, PartialQuestion, PartialPassage, UserQuestionProgress, UserPassageProgress } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export default function PracticePage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const [questions, setQuestions] = useState<PartialQuestion[]>([]);
  const [passages, setPassages] = useState<PartialPassage[]>([]);
  const [questionProgress, setQuestionProgress] = useState<Record<string, UserQuestionProgress>>({});
  const [passageProgress, setPassageProgress] = useState<Record<string, UserPassageProgress>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize filters from sessionStorage
  const getInitialFilters = () => {
    const savedFilters = sessionStorage.getItem('practiceFilters');
    if (savedFilters) {
      try {
        return JSON.parse(savedFilters);
      } catch (err) {
        console.error('Failed to restore filters:', err);
      }
    }
    return null;
  };

  const initialFilters = getInitialFilters();
  const [page, setPage] = useState(initialFilters?.page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [difficultyFilter, setDifficultyFilter] = useState<string>(initialFilters?.difficulty || 'all');
  const [typeFilter, setTypeFilter] = useState<string>(initialFilters?.type || 'all');
  const [showNew, setShowNew] = useState(initialFilters?.showNew || false);

  // Helper functions to update filters and reset page
  const handleDifficultyChange = (value: string) => {
    setDifficultyFilter(value);
    setPage(1);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setPage(1);
  };

  const handleShowNewToggle = () => {
    setShowNew(!showNew);
    setPage(1);
  };

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
        // Show ONLY passages for RC
        const response = await apiService.getPassages(baseParams);
        fetchedPassages = response.passages || [];
        fetchedQuestions = [];
        setTotalPages(response.totalPages || 1);
      } else if (typeFilter === 'all') {
        // Use smart aggregation that fills gaps automatically
        const response = await apiService.getMixedPracticeContent(baseParams);
        
        fetchedPassages = response.passages;
        fetchedQuestions = response.questions;
        setTotalPages(response.totalPages);
      } else {
        // Show specific question type (TC or SE only)
        const response = await apiService.getQuestions({ ...baseParams, type: typeFilter });
        fetchedQuestions = response.questions || [];
        fetchedPassages = [];
        setTotalPages(response.totalPages || 1);
      }

      setPassages(fetchedPassages);
      setQuestions(fetchedQuestions);
      
      // Fetch progress data for the fetched questions and passages
      try {
        const questionIds = fetchedQuestions.map(q => q.id);
        const passageIds = fetchedPassages.map(p => p.id);
        
        console.log('Fetching progress for:', { questionIds, passageIds });
        
        const [qProgress, pProgress] = await Promise.all([
          questionIds.length > 0 ? apiService.getBulkQuestionProgress(questionIds) : Promise.resolve({}),
          passageIds.length > 0 ? apiService.getBulkPassageProgress(passageIds) : Promise.resolve({})
        ]);
        
        console.log('Received progress:', { qProgress, pProgress });
        
        setQuestionProgress(qProgress);
        setPassageProgress(pProgress);
      } catch (progressErr) {
        console.error('Failed to fetch progress:', progressErr);
        // Don't block UI if progress fetch fails
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

  const handleQuestionClick = (questionId: string) => {
    // Build unified navigation structure
    const navigationItems = [
      ...passages.map(p => ({
        type: 'passage' as const,
        id: p.id,
        questionIds: p.question_ids
      })),
      ...questions.map(q => ({
        type: 'question' as const,
        id: q.id,
        questionIds: [q.id]
      }))
    ];
    
    sessionStorage.setItem('navigationItems', JSON.stringify(navigationItems));
    sessionStorage.setItem('currentQuestionId', questionId);
    sessionStorage.removeItem('passageId');
    sessionStorage.removeItem('questionIds');
    sessionStorage.setItem('backRoute', `/${username}/practice`); // Save practice list as back route
    
    // Store current filter state
    sessionStorage.setItem('practiceFilters', JSON.stringify({
      difficulty: difficultyFilter,
      type: typeFilter,
      showNew,
      page,
    }));
    
    router.push(`/${username}/practice/${questionId}`);
  };

  const handlePassageClick = (passageId: string, questionIds: string[]) => {
    // Build unified navigation structure
    const navigationItems = [
      ...passages.map(p => ({
        type: 'passage' as const,
        id: p.id,
        questionIds: p.question_ids
      })),
      ...questions.map(q => ({
        type: 'question' as const,
        id: q.id,
        questionIds: [q.id]
      }))
    ];
    
    sessionStorage.setItem('navigationItems', JSON.stringify(navigationItems));
    sessionStorage.setItem('currentPassageId', passageId);
    sessionStorage.setItem('currentQuestionId', questionIds[0]);
    sessionStorage.removeItem('passageId');
    sessionStorage.removeItem('questionIds'); // Remove old storage keys
    sessionStorage.setItem('backRoute', `/${username}/practice`); // Save practice list as back route
    
    // Store current filter state
    sessionStorage.setItem('practiceFilters', JSON.stringify({
      difficulty: difficultyFilter,
      type: typeFilter,
      showNew,
      page,
    }));
    
    // Navigate to the first question of the passage
    router.push(`/${username}/practice/${questionIds[0]}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Practice Questions</h1>
        <p className="text-muted-foreground mt-2">
          Click on a question to start practicing!
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Label htmlFor="difficulty-filter" className="text-sm font-medium">
            Difficulty:
          </Label>
          <Select value={difficultyFilter} onValueChange={handleDifficultyChange}>
            <SelectTrigger id="difficulty-filter" className="w-[140px]">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="type-filter" className="text-sm font-medium">
            Type:
          </Label>
          <Select value={typeFilter} onValueChange={handleTypeChange}>
            <SelectTrigger id="type-filter" className="w-[200px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="text_completion">Text Completion</SelectItem>
              <SelectItem value="sentence_equivalence">Sentence Equivalence</SelectItem>
              <SelectItem value="reading_comprehension">Reading Comprehension</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant={showNew ? "default" : "outline"}
          onClick={handleShowNewToggle}
          size="sm"
        >
          Show New Only
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <Button onClick={fetchQuestions} className="mt-4">
            Try Again
          </Button>
        </div>
      )}

      {/* Content Grid */}
      {!loading && !error && (
        <>
          {passages.length === 0 && (!questions || questions.length === 0) ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No content found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Render passages */}
              {passages.map((passage) => (
                <PassageCard
                  key={passage.id}
                  passage={passage}
                  progress={passageProgress[passage.id]}
                  onClick={() => handlePassageClick(passage.id, passage.question_ids)}
                />
              ))}
              
              {/* Render questions */}
              {questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  progress={questionProgress[question.id]}
                  onClick={() => handleQuestionClick(question.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-8"
          />
        </>
      )}
    </div>
  );
}
