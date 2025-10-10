'use client';

import { useState, useMemo, useEffect } from 'react';
import { Question } from '@/lib/models/question';
import { getOptionsForBlank, findChoiceByOption } from '@/lib/questionUtils';
import { BaseQuestion } from './BaseQuestion';
import { OptionButton } from './OptionButton';
import { useShuffledOptions, checkMultipleCorrect, getQuestionResult } from './questionUtils';
import { useQuestionProgress } from '@/hooks/useQuestionProgress';

interface SentenceEquivalenceQuestionProps {
  question: Question;
  passageId?: string;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export function SentenceEquivalenceQuestion({ question, passageId, onNext, onPrev, hasNext = false, hasPrev = false }: SentenceEquivalenceQuestionProps) {
  const { submitAttempt, resetSubmission, progress } = useQuestionProgress(question.id, passageId);

  // Extract options from choices (SE questions only have blank 1)
  const options = useMemo(() => 
    getOptionsForBlank(question.choices, 1), 
    [question.choices]
  );

  // Use shared shuffled options hook
  const shuffledOptions = useShuffledOptions(options);

  const [selectedOptions, setSelectedOptions] = useState<Set<number>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOptions(new Set());
    setIsSubmitted(false);
  }, [question.id]);

  const handleOptionToggle = (shuffledIndex: number) => {
    if (isSubmitted) return;

    const newSelected = new Set(selectedOptions);
    if (newSelected.has(shuffledIndex)) {
      newSelected.delete(shuffledIndex);
    } else {
      if (newSelected.size < 2) {
        newSelected.add(shuffledIndex);
      }
    }
    setSelectedOptions(newSelected);
  };

  const handleSubmit = async () => {
    if (selectedOptions.size !== 2) return;

    // Check if all selected options are correct
    const allCorrect = checkMultipleCorrect(
      Array.from(selectedOptions),
      shuffledOptions,
      question.choices,
      findChoiceByOption
    );

    setIsSubmitted(true);
    await submitAttempt(allCorrect);
  };

  const handleReset = () => {
    setSelectedOptions(new Set());
    setIsSubmitted(false);
    resetSubmission();
  };

  // Use shared utility to check if all selected options are correct
  const allCorrect = isSubmitted && selectedOptions.size === 2
    ? checkMultipleCorrect(
        Array.from(selectedOptions),
        shuffledOptions,
        question.choices,
        findChoiceByOption
      )
    : false;

  const result = getQuestionResult(
    isSubmitted,
    allCorrect,
    'Correct! You selected both correct answers.',
    'Incorrect. Review the explanations below.'
  );

  const instructions = "Select TWO answer choices that complete the sentence and produce sentences with similar meanings.";

  return (
    <BaseQuestion
      question={question}
      progress={progress}
      result={result}
      instructions={instructions}
      onClear={handleReset}
      onSubmit={handleSubmit}
      submitDisabled={selectedOptions.size !== 2 || isSubmitted}
      onPrev={onPrev}
      onNext={onNext}
      hasPrev={hasPrev}
      hasNext={hasNext}
    >

      <div className="grid grid-cols-1 gap-1.5">
        {shuffledOptions.map(({ option }, shuffledIndex) => {
          const choice = findChoiceByOption(question.choices, option);
          const isSelected = selectedOptions.has(shuffledIndex);
          const isCorrect = choice?.is_correct || false;
          
          return (
            <OptionButton
              key={shuffledIndex}
              option={option}
              isSelected={isSelected}
              isCorrect={isCorrect}
              isSubmitted={isSubmitted}
              choice={choice || null}
              onClick={() => handleOptionToggle(shuffledIndex)}
            />
          );
        })}
      </div>
    </BaseQuestion>
  );
}
