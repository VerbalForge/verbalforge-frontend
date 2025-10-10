'use client';

import { useState, useEffect, useMemo } from 'react';
import { Question } from '@/lib/models/question';
import { BaseQuestion } from './BaseQuestion';
import { OptionButton } from './OptionButton';
import { getOptionsForBlank, findChoiceByOption } from '@/lib/questionUtils';
import { useQuestionProgress } from '@/hooks/useQuestionProgress';
import { useShuffledOptions, getQuestionResult } from './questionUtils';

interface TextCompletionQuestionProps {
  question: Question;
  passageId?: string;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export function TextCompletionQuestion({ 
  question, 
  passageId, 
  onNext, 
  onPrev, 
  hasNext = false, 
  hasPrev = false 
}: TextCompletionQuestionProps) {
  const { submitAttempt, resetSubmission, progress } = useQuestionProgress(question.id, passageId);
  
  const options = useMemo(() => getOptionsForBlank(question.choices, 1), [question.choices]);
  const shuffledOptions = useShuffledOptions(options);
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [question.id]);

  const handleOptionToggle = (shuffledIndex: number) => {
    if (isSubmitted) return;
    setSelectedOption(shuffledIndex);
  };

  const handleSubmit = async () => {
    if (selectedOption === null) return;
    
    const { option: optionText } = shuffledOptions[selectedOption];
    const choice = findChoiceByOption(question.choices, optionText);
    const isCorrect = choice?.is_correct || false;
    
    setIsSubmitted(true);
    await submitAttempt(isCorrect);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    resetSubmission();
  };

  const getOptionStatus = (shuffledIndex: number) => {
    const { option: optionText } = shuffledOptions[shuffledIndex];
    const choice = findChoiceByOption(question.choices, optionText);
    const isCorrect = choice?.is_correct || false;
    const isSelected = selectedOption === shuffledIndex;

    return { isCorrect, isSelected, choice: isSubmitted ? (choice || null) : null };
  };

  // Check if selection is correct
  const isCorrect = isSubmitted && selectedOption !== null
    ? getOptionStatus(selectedOption).isCorrect
    : false;

  const result = getQuestionResult(
    isSubmitted && selectedOption !== null,
    isCorrect
  );

  return (
    <BaseQuestion
      question={question}
      progress={progress}
      result={result}
      instructions="Select the answer choice that best completes the sentence."
      onClear={handleReset}
      onSubmit={handleSubmit}
      submitDisabled={selectedOption === null || isSubmitted}
      onNext={onNext}
      onPrev={onPrev}
      hasNext={hasNext}
      hasPrev={hasPrev}
    >
      {/* Single column grid for consistency */}
      <div className="grid grid-cols-1 gap-1.5">
        {shuffledOptions.map((item, shuffledIndex) => {
          const { isSelected, isCorrect, choice } = getOptionStatus(shuffledIndex);
          return (
            <OptionButton
              key={shuffledIndex}
              option={item.option}
              isSelected={isSelected}
              isSubmitted={isSubmitted}
              isCorrect={isCorrect}
              choice={choice}
              onClick={() => handleOptionToggle(shuffledIndex)}
            />
          );
        })}
      </div>
    </BaseQuestion>
  );
}
