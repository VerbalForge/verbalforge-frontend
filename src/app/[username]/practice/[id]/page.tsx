'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiService, Question } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { SentenceEquivalenceQuestion } from '@/components/questions/SentenceEquivalenceQuestion';
import { TextCompletionQuestion } from '@/components/questions/TextCompletionQuestion';
import { TextCompletionDoubleQuestion } from '@/components/questions/TextCompletionDoubleQuestion';
import { TextCompletionTripleQuestion } from '@/components/questions/TextCompletionTripleQuestion';
import { ReadingComprehensionQuestion } from '@/components/questions/ReadingComprehensionQuestion';

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params.id as string;
  const username = params.username as string;

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    // Get question IDs from sessionStorage
    const storedIds = sessionStorage.getItem('questionIds');
    if (storedIds) {
      const ids = JSON.parse(storedIds);
      setQuestionIds(ids);
      setCurrentIndex(ids.indexOf(questionId));
    }
  }, [questionId]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const data = await apiService.getQuestionById(questionId);
        setQuestion(data);
      } catch (err) {
        console.error('Error fetching question:', err);
        setError('Failed to load question. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < questionIds.length - 1) {
      const nextId = questionIds[currentIndex + 1];
      router.push(`/${username}/practice/${nextId}`);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevId = questionIds[currentIndex - 1];
      router.push(`/${username}/practice/${prevId}`);
    }
  };

  const hasNext = currentIndex >= 0 && currentIndex < questionIds.length - 1;
  const hasPrev = currentIndex > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error || 'Question not found'}</p>
        <Button onClick={() => router.push(`/${username}/practice`)}>
          Back to Practice
        </Button>
      </div>
    );
  }

  const renderQuestion = () => {
    const questionType = question.question_type.toLowerCase();

    if (questionType.includes('reading_comprehension')) {
      return (
        <ReadingComprehensionQuestion 
          question={question} 
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      );
    }

    if (questionType.includes('sentence_equivalence')) {
      return (
        <SentenceEquivalenceQuestion 
          question={question} 
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      );
    }

    if (questionType.includes('text_completion_single')) {
      return (
        <TextCompletionQuestion 
          question={question} 
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      );
    }

    if (questionType.includes('text_completion_double')) {
      return (
        <TextCompletionDoubleQuestion 
          question={question} 
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      );
    }

    if (questionType.includes('text_completion_triple')) {
      return (
        <TextCompletionTripleQuestion 
          question={question} 
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      );
    }

    // Placeholder for other question types
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Question type &quot;{question.question_type}&quot; is not yet supported.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/${username}/practice`)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">Question</h1>
          <p className="text-xs text-muted-foreground">{question.topic}</p>
        </div>
      </div>

      {renderQuestion()}
    </div>
  );
}
