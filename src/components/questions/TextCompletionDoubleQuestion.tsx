'use client';

import { Question } from '@/lib/api';
import { BaseQuestion } from './BaseQuestion';
import { OptionButton } from './OptionButton';
import { useState, useMemo, useEffect } from 'react';
import { useQuestionProgress } from '@/hooks/useQuestionProgress';
import { getOptionsForBlank, findChoiceByOption } from '@/lib/questionUtils';
import { useShuffledOptions } from './questionUtils';

interface TextCompletionDoubleQuestionProps {
  question: Question;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export function TextCompletionDoubleQuestion({
  question,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: TextCompletionDoubleQuestionProps) {
  const { progress, submitAttempt, resetSubmission } = useQuestionProgress(question.id);
  
  const [selectedBlank1, setSelectedBlank1] = useState<number | null>(null);
  const [selectedBlank2, setSelectedBlank2] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get and shuffle options for each blank
  const blank1Options = useMemo(() => getOptionsForBlank(question.choices, 1), [question.choices]);
  const blank2Options = useMemo(() => getOptionsForBlank(question.choices, 2), [question.choices]);

  const shuffledBlank1 = useShuffledOptions(blank1Options);
  const shuffledBlank2 = useShuffledOptions(blank2Options);

  // Reset state when question changes
  useEffect(() => {
    setSelectedBlank1(null);
    setSelectedBlank2(null);
    setIsSubmitted(false);
  }, [question.id]);

  const handleBlank1Toggle = (index: number) => {
    if (!isSubmitted) setSelectedBlank1(index);
  };

  const handleBlank2Toggle = (index: number) => {
    if (!isSubmitted) setSelectedBlank2(index);
  };

  const handleSubmit = async () => {
    if (selectedBlank1 === null || selectedBlank2 === null || isSubmitted) return;

    const option1 = shuffledBlank1[selectedBlank1].option;
    const option2 = shuffledBlank2[selectedBlank2].option;
    
    const choice1 = findChoiceByOption(question.choices, option1);
    const choice2 = findChoiceByOption(question.choices, option2);
    
    const isCorrect = (choice1?.is_correct || false) && (choice2?.is_correct || false);
    
    setIsSubmitted(true);
    await submitAttempt(isCorrect);
  };

  const handleReset = () => {
    setSelectedBlank1(null);
    setSelectedBlank2(null);
    setIsSubmitted(false);
    resetSubmission();
  };

  // Check correctness for each blank
  const blank1Correct = isSubmitted && selectedBlank1 !== null
    ? findChoiceByOption(question.choices, shuffledBlank1[selectedBlank1].option)?.is_correct || false
    : false;
  
  const blank2Correct = isSubmitted && selectedBlank2 !== null
    ? findChoiceByOption(question.choices, shuffledBlank2[selectedBlank2].option)?.is_correct || false
    : false;

  // Determine result based on correctness
  const result = (() => {
    if (!isSubmitted || selectedBlank1 === null || selectedBlank2 === null) return null;
    
    if (blank1Correct && blank2Correct) {
      return { type: 'success' as const, message: 'Correct! You selected both correct answers.' };
    } else if (blank1Correct || blank2Correct) {
      return { type: 'partial' as const, message: 'Partially correct. One answer is correct.' };
    } else {
      return { type: 'error' as const, message: 'Incorrect. Review the explanations below.' };
    }
  })();

  return (
    <BaseQuestion
      question={question}
      progress={progress}
      result={result}
      instructions="Select one answer choice for each blank to complete the sentence."
      onClear={handleReset}
      onSubmit={handleSubmit}
      submitDisabled={selectedBlank1 === null || selectedBlank2 === null || isSubmitted}
      onPrev={onPrev}
      onNext={onNext}
      hasPrev={hasPrev}
      hasNext={hasNext}
    >
      <div className="space-y-1.5">
        {/* Headers */}
        <div className="grid grid-cols-2 gap-x-3">
          <p className="text-sm font-medium text-foreground">Blank 1:</p>
          <p className="text-sm font-medium text-foreground">Blank 2:</p>
        </div>

        {/* Options Grid - 3 rows, 2 columns */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {/* Row 1 */}
          <OptionButton
            option={shuffledBlank1[0].option}
            choice={findChoiceByOption(question.choices, shuffledBlank1[0].option) || null}
            isSelected={selectedBlank1 === 0}
            isCorrect={findChoiceByOption(question.choices, shuffledBlank1[0].option)?.is_correct || false}
            isSubmitted={isSubmitted}
            onClick={() => handleBlank1Toggle(0)}
          />
          <OptionButton
            option={shuffledBlank2[0].option}
            choice={findChoiceByOption(question.choices, shuffledBlank2[0].option) || null}
            isSelected={selectedBlank2 === 0}
            isCorrect={findChoiceByOption(question.choices, shuffledBlank2[0].option)?.is_correct || false}
            isSubmitted={isSubmitted}
            onClick={() => handleBlank2Toggle(0)}
          />
          
          {/* Row 2 */}
          <OptionButton
            option={shuffledBlank1[1].option}
            choice={findChoiceByOption(question.choices, shuffledBlank1[1].option) || null}
            isSelected={selectedBlank1 === 1}
            isCorrect={findChoiceByOption(question.choices, shuffledBlank1[1].option)?.is_correct || false}
            isSubmitted={isSubmitted}
            onClick={() => handleBlank1Toggle(1)}
          />
          <OptionButton
            option={shuffledBlank2[1].option}
            choice={findChoiceByOption(question.choices, shuffledBlank2[1].option) || null}
            isSelected={selectedBlank2 === 1}
            isCorrect={findChoiceByOption(question.choices, shuffledBlank2[1].option)?.is_correct || false}
            isSubmitted={isSubmitted}
            onClick={() => handleBlank2Toggle(1)}
          />
          
          {/* Row 3 */}
          <OptionButton
            option={shuffledBlank1[2].option}
            choice={findChoiceByOption(question.choices, shuffledBlank1[2].option) || null}
            isSelected={selectedBlank1 === 2}
            isCorrect={findChoiceByOption(question.choices, shuffledBlank1[2].option)?.is_correct || false}
            isSubmitted={isSubmitted}
            onClick={() => handleBlank1Toggle(2)}
          />
          <OptionButton
            option={shuffledBlank2[2].option}
            choice={findChoiceByOption(question.choices, shuffledBlank2[2].option) || null}
            isSelected={selectedBlank2 === 2}
            isCorrect={findChoiceByOption(question.choices, shuffledBlank2[2].option)?.is_correct || false}
            isSubmitted={isSubmitted}
            onClick={() => handleBlank2Toggle(2)}
          />
        </div>
      </div>
    </BaseQuestion>
  );
}
