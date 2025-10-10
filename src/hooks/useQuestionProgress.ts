import { useState, useEffect, useCallback } from 'react';
import { UserQuestionProgress } from '@/lib/models/question';
import { questionService } from '@/lib/services/questionService';
import { passageService } from '@/lib/services/passageService';
import { toast } from 'sonner';

export function useQuestionProgress(questionId: string, passageId?: string) {
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [progress, setProgress] = useState<UserQuestionProgress | null>(null);

  // Fetch existing progress when question changes
  useEffect(() => {
    setStartTime(Date.now());
    setHasSubmitted(false);
    
    const fetchProgress = async () => {
      try {
        const data = await questionService.getQuestionProgress(questionId);
        setProgress(data);
      } catch (error) {
        console.error('Failed to fetch progress:', error);
        setProgress(null);
      }
    };
    
    fetchProgress();
  }, [questionId]);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const submitAttempt = useCallback(async (solved: boolean) => {
    if (isSubmitting) return; // Only prevent if currently submitting, allow re-submission

    setIsSubmitting(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000); // Convert to seconds

    // Optimistically update progress state immediately
    setProgress(prev => {
      if (prev) {
        // Update existing progress
        return {
          ...prev,
          attempted: true,
          solved: solved || prev.solved, // Once solved, always solved
          timeTaken: prev.timeTaken + timeTaken,
          lastAttemptAt: new Date().toISOString(),
          ...(solved && { lastSolvedAt: new Date().toISOString() }),
        };
      } else {
        // Create initial optimistic progress for first attempt
        return {
          userId: '', // Will be filled by server response
          questionId,
          solved,
          attempted: true,
          lastAttemptAt: new Date().toISOString(),
          ...(solved && { lastSolvedAt: new Date().toISOString() }),
          timeTaken,
          difficulty_level: '', // Will be filled by server response
          question_type: '', // Will be filled by server response
          xpGained: 0, // Will be filled by server response
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    });

    try {
      if (passageId) {
        // Passage-based question (RC)
        const result = await passageService.submitPassageAttempt(passageId, {
          questionAttempts: [{
            questionId,
            solved,
            timeTaken,
          }],
        });
        // Update with server response
        setProgress(result.question);
      } else {
        // Standalone question (TC, SE)
        const result = await questionService.submitQuestionAttempt(questionId, {
          solved,
          timeTaken,
        });
        // Update with server response
        setProgress(result);
      }
      setHasSubmitted(true);
      
      // Show toast notification for correct answers
      if (solved) {
        toast.success(`Solved in ${formatTime(timeTaken)}`, {
          duration: 4000,
        });
        // Reset timer on correct attempt so next question starts fresh
        setStartTime(Date.now());
      }
    } catch (error) {
      console.error('Failed to submit attempt:', error);
      // Don't block user from continuing even if submission fails
    } finally {
      setIsSubmitting(false);
    }
  }, [questionId, passageId, startTime, isSubmitting]);

  const resetSubmission = useCallback(() => {
    setHasSubmitted(false);
  }, []);

  return {
    submitAttempt,
    resetSubmission,
    isSubmitting,
    hasSubmitted,
    progress,
  };
}
