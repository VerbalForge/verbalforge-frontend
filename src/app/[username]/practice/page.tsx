'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { QuestionCard } from '@/components/QuestionCard';
import { apiService, PartialQuestion } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: {
        page: number;
        limit: number;
        difficulty?: string;
        type?: string;
        new?: boolean;
      } = { page, limit: 20 };
      
      if (difficultyFilter !== 'all') params.difficulty = difficultyFilter;
      if (typeFilter !== 'all') params.type = typeFilter;
      if (showNew) params.new = true;

      const response = await apiService.getQuestions(params);
      setQuestions(response.questions || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError('Failed to load questions. Please try again.');
      console.error('Error fetching questions:', err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [page, difficultyFilter, typeFilter, showNew]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleQuestionClick = (questionId: string) => {
    // Store question IDs and filters in sessionStorage for navigation
    const questionIds = questions.map(q => q.question_id);
    sessionStorage.setItem('questionIds', JSON.stringify(questionIds));
    
    // Store current filter state
    sessionStorage.setItem('practiceFilters', JSON.stringify({
      difficulty: difficultyFilter,
      type: typeFilter,
      showNew,
      page,
    }));
    
    router.push(`/${username}/practice/${questionId}`);
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
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
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
          <Select value={typeFilter} onValueChange={setTypeFilter}>
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
          onClick={() => setShowNew(!showNew)}
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

      {/* Questions Grid */}
      {!loading && !error && (
        <>
          {!questions || questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No questions found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {questions.map((question) => (
                <QuestionCard
                  key={question.question_id}
                  question={question}
                  onClick={() => handleQuestionClick(question.question_id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
