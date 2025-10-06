import { useState, useEffect, useCallback } from 'react';
import { apiService, UserQuestionProgress } from '@/lib/api';

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
        const data = await apiService.getQuestionProgress(questionId);
        setProgress(data);
      } catch (error) {
        console.error('Failed to fetch progress:', error);
        setProgress(null);
      }
    };
    
    fetchProgress();
  }, [questionId]);

  const submitAttempt = useCallback(async (solved: boolean) => {
    if (isSubmitting) return; // Only prevent if currently submitting, allow re-submission

    setIsSubmitting(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000); // Convert to seconds

    try {
      if (passageId) {
        // Passage-based question (RC)
        const result = await apiService.submitPassageAttempt(passageId, questionId, solved, timeTaken);
        console.log('Progress updated (passage):', result.question);
        setProgress(result.question);
      } else {
        // Standalone question (TC, SE)
        const result = await apiService.submitQuestionAttempt(questionId, solved, timeTaken);
        console.log('Progress updated (question):', result);
        setProgress(result);
      }
      setHasSubmitted(true);
    } catch (error) {
      console.error('Failed to submit attempt:', error);
      // Don't block user from continuing even if submission fails
    } finally {
      setIsSubmitting(false);
    }
  }, [questionId, passageId, startTime, isSubmitting]);

  const resetSubmission = useCallback(() => {
    setHasSubmitted(false);
    setStartTime(Date.now()); // Reset timer when clearing
  }, []);

  return {
    submitAttempt,
    resetSubmission,
    isSubmitting,
    hasSubmitted,
    progress,
  };
}
