'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiService, Question, Passage } from '@/lib/api';
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
  const [passage, setPassage] = useState<Passage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [navigationItems, setNavigationItems] = useState<Array<{
    type: 'passage' | 'question';
    id: string;
    questionIds: string[];
  }>>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [currentItemIndex, setCurrentItemIndex] = useState(-1);
  const [currentPassageId, setCurrentPassageId] = useState<string | null>(null);

  // Main effect: Load navigation state and fetch question when questionId changes
  // Note: In development with React Strict Mode, this will run twice - this is intentional
  useEffect(() => {
    const loadDataAndNavigation = async () => {
      setLoading(true);
      setError(null);
      
      // Load navigation items from session storage
      const storedItems = sessionStorage.getItem('navigationItems');
      const storedPassageId = sessionStorage.getItem('currentPassageId');
      
      if (storedItems) {
        const items = JSON.parse(storedItems) as Array<{
          type: 'passage' | 'question';
          id: string;
          questionIds: string[];
        }>;
        setNavigationItems(items);
        
        // Only update currentPassageId if it actually changed to avoid unnecessary passage fetch
        setCurrentPassageId(prev => {
          if (prev !== storedPassageId) {
            return storedPassageId;
          }
          return prev;
        });
        
        // Find current item and question index
        if (storedPassageId) {
          // We're in a passage
          const itemIndex = items.findIndex(item => item.type === 'passage' && item.id === storedPassageId);
          setCurrentItemIndex(itemIndex);
          if (itemIndex >= 0) {
            const questionIndex = items[itemIndex].questionIds.indexOf(questionId);
            setCurrentQuestionIndex(questionIndex);
          }
        } else {
          // We're in a standalone question
          const itemIndex = items.findIndex(item => item.type === 'question' && item.id === questionId);
          setCurrentItemIndex(itemIndex);
          setCurrentQuestionIndex(0);
        }
      }
      
      // Fetch question data
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

    loadDataAndNavigation();
  }, [questionId]);

  // Separate effect: Fetch passage only when passage ID changes
  // Note: In development with React Strict Mode, this will run twice - this is intentional
  useEffect(() => {
    if (!currentPassageId) {
      setPassage(null);
      return;
    }

    const fetchPassage = async () => {
      try {
        const passageData = await apiService.getPassageById(currentPassageId);
        setPassage(passageData);
      } catch (passageErr) {
        console.error('Error fetching passage:', passageErr);
        setPassage(null);
      }
    };

    fetchPassage();
  }, [currentPassageId]);

  const handleNext = () => {
    if (currentItemIndex < 0 || navigationItems.length === 0) return;
    
    const currentItem = navigationItems[currentItemIndex];
    
    // Check if there's a next question in the current item (passage or question)
    if (currentQuestionIndex < currentItem.questionIds.length - 1) {
      // Move to next question in same item
      const nextQuestionId = currentItem.questionIds[currentQuestionIndex + 1];
      sessionStorage.setItem('currentQuestionId', nextQuestionId);
      router.push(`/${username}/practice/${nextQuestionId}`);
    } else if (currentItemIndex < navigationItems.length - 1) {
      // Move to next item (passage or question)
      const nextItem = navigationItems[currentItemIndex + 1];
      const nextQuestionId = nextItem.questionIds[0];
      
      if (nextItem.type === 'passage') {
        sessionStorage.setItem('currentPassageId', nextItem.id);
      } else {
        sessionStorage.removeItem('currentPassageId');
      }
      sessionStorage.setItem('currentQuestionId', nextQuestionId);
      router.push(`/${username}/practice/${nextQuestionId}`);
    }
  };

  const handlePrev = () => {
    if (currentItemIndex < 0 || navigationItems.length === 0) return;
    
    const currentItem = navigationItems[currentItemIndex];
    
    // Check if there's a previous question in the current item
    if (currentQuestionIndex > 0) {
      // Move to previous question in same item
      const prevQuestionId = currentItem.questionIds[currentQuestionIndex - 1];
      sessionStorage.setItem('currentQuestionId', prevQuestionId);
      router.push(`/${username}/practice/${prevQuestionId}`);
    } else if (currentItemIndex > 0) {
      // Move to previous item's last question
      const prevItem = navigationItems[currentItemIndex - 1];
      const prevQuestionId = prevItem.questionIds[prevItem.questionIds.length - 1];
      
      if (prevItem.type === 'passage') {
        sessionStorage.setItem('currentPassageId', prevItem.id);
      } else {
        sessionStorage.removeItem('currentPassageId');
      }
      sessionStorage.setItem('currentQuestionId', prevQuestionId);
      router.push(`/${username}/practice/${prevQuestionId}`);
    }
  };

  const hasNext = () => {
    if (currentItemIndex < 0 || navigationItems.length === 0) return false;
    const currentItem = navigationItems[currentItemIndex];
    // Has next if there's another question in current item OR another item exists
    return currentQuestionIndex < currentItem.questionIds.length - 1 || currentItemIndex < navigationItems.length - 1;
  };

  const hasPrev = () => {
    if (currentItemIndex < 0 || navigationItems.length === 0) return false;
    // Has prev if there's a previous question in current item OR a previous item exists
    return currentQuestionIndex > 0 || currentItemIndex > 0;
  };
  
  const hasNextValue = hasNext();
  const hasPrevValue = hasPrev();

  // Handle back navigation - uses saved route (dashboard or practice list)
  const handleBackToPractice = () => {
    const backRoute = sessionStorage.getItem('backRoute') || `/${username}/practice`;
    sessionStorage.removeItem('navigationItems');
    sessionStorage.removeItem('currentPassageId');
    sessionStorage.removeItem('currentQuestionId');
    sessionStorage.removeItem('backRoute');
    router.push(backRoute);
  };

  // Get friendly question type name
  const getQuestionTypeName = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('reading_comprehension')) return 'Reading Comprehension';
    if (typeLower.includes('sentence_equivalence')) return 'Sentence Equivalence';
    if (typeLower.includes('text_completion')) return 'Text Completion';
    return 'Question';
  };

  // Get subtitle - use passage title for RC questions, topic for others
  const getSubtitle = () => {
    if (!question) return '';
    const isRC = question.question_type.toLowerCase().includes('reading_comprehension');
    if (isRC && passage?.title) {
      return passage.title;
    }
    return question.topic;
  };

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
        <Button onClick={handleBackToPractice}>
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
          passage={passage}
          passageId={currentPassageId || undefined}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={hasNextValue}
          hasPrev={hasPrevValue}
        />
      );
    }

    if (questionType.includes('sentence_equivalence')) {
      return (
        <SentenceEquivalenceQuestion 
          question={question}
          passageId={currentPassageId || undefined}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={hasNextValue}
          hasPrev={hasPrevValue}
        />
      );
    }

    if (questionType.includes('text_completion_single')) {
      return (
        <TextCompletionQuestion 
          question={question}
          passageId={currentPassageId || undefined}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={hasNextValue}
          hasPrev={hasPrevValue}
        />
      );
    }

    if (questionType.includes('text_completion_double')) {
      return (
        <TextCompletionDoubleQuestion 
          question={question}
          passageId={currentPassageId || undefined}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={hasNextValue}
          hasPrev={hasPrevValue}
        />
      );
    }

    if (questionType.includes('text_completion_triple')) {
      return (
        <TextCompletionTripleQuestion 
          question={question}
          passageId={currentPassageId || undefined}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={hasNextValue}
          hasPrev={hasPrevValue}
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
          onClick={handleBackToPractice}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">{getQuestionTypeName(question.question_type)}</h1>
          <p className="text-xs text-muted-foreground">{getSubtitle()}</p>
        </div>
      </div>

      {renderQuestion()}
    </div>
  );
}
