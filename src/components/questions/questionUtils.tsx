/**
 * Common utilities for question components
 * Implements DRY principles for shared logic
 */

import { useMemo } from 'react';
import type { Choice } from '@/lib/api';

// Fisher-Yates shuffle algorithm
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Create shuffled options with original indices
export const useShuffledOptions = (options: string[], shouldShuffle = true) => {
  return useMemo(() => {
    const mapped = options.map((option, index) => ({ option, originalIndex: index }));
    return shouldShuffle ? shuffleArray(mapped) : mapped;
  }, [options, shouldShuffle]);
};

// Toggle option in a Set
export const toggleInSet = <T,>(set: Set<T>, value: T, maxSize?: number): Set<T> => {
  const newSet = new Set(set);
  if (newSet.has(value)) {
    newSet.delete(value);
  } else {
    if (maxSize && newSet.size >= maxSize) {
      return newSet; // Don't add if at max capacity
    }
    newSet.add(value);
  }
  return newSet;
};

// Toggle single option (clear others)
export const toggleSingleOption = <T,>(set: Set<T>, value: T): Set<T> => {
  const newSet = new Set<T>();
  if (!set.has(value)) {
    newSet.add(value);
  }
  return newSet;
};

// Get option class names based on state
export const getOptionClassName = (
  isSelected: boolean,
  isSubmitted: boolean,
  isCorrect: boolean,
  baseClass = 'px-3 py-2.5 rounded-lg border-2 cursor-pointer transition-all text-sm'
): string => {
  if (!isSubmitted) {
    return `${baseClass} ${
      isSelected
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-600'
        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-gray-800'
    }`;
  }

  // After submission
  if (isSelected && isCorrect) {
    return `${baseClass} border-green-500 bg-green-50 dark:bg-green-950/30 dark:border-green-600`;
  } else if (isSelected && !isCorrect) {
    return `${baseClass} border-red-500 bg-red-50 dark:bg-red-950/30 dark:border-red-600`;
  } else if (!isSelected && isCorrect) {
    return `${baseClass} border-green-500 bg-green-50 dark:bg-green-950/30 dark:border-green-600`;
  } else {
    return `${baseClass} border-gray-200 dark:border-gray-700 opacity-50`;
  }
};

// Format result message
export const createResultMessage = (
  isCorrect: boolean,
  customSuccessMsg?: string,
  customErrorMsg?: string
): { type: 'success' | 'error'; message: string } => {
  return {
    type: isCorrect ? 'success' : 'error',
    message: isCorrect
      ? customSuccessMsg || 'Correct! You selected the right answer.'
      : customErrorMsg || 'Incorrect. Review the explanations below.',
  };
};

// Check if selected options are correct (for multi-select questions)
export const checkMultipleCorrect = <T,>(
  selectedIndices: number[],
  shuffledOptions: Array<{ option: T; originalIndex: number }>,
  choices: Choice[],
  findChoiceFn: (choices: Choice[], optionText: T) => Choice | null | undefined
): boolean => {
  return selectedIndices.every(shuffledIndex => {
    const { option: optionText } = shuffledOptions[shuffledIndex];
    const choice = findChoiceFn(choices, optionText);
    return choice?.is_correct || false;
  });
};

// Generic result message for questions (handles submitted state check)
export const getQuestionResult = (
  isSubmitted: boolean,
  isCorrect: boolean,
  successMsg?: string,
  errorMsg?: string
): { type: 'success' | 'error'; message: string } | null => {
  if (!isSubmitted) return null;
  return createResultMessage(isCorrect, successMsg, errorMsg);
};
