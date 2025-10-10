'use client';

import { useState, useMemo, useEffect } from 'react';
import { Question } from '@/lib/models/question';
import { Passage } from '@/lib/models/passage';
import { BaseQuestion } from './BaseQuestion';
import { OptionButton } from './OptionButton';
import { PassageDisplay } from './PassageDisplay';
import { getOptionsForBlank, findChoiceByOption } from '@/lib/questionUtils';
import { useQuestionProgress } from '@/hooks/useQuestionProgress';
import { shuffleArray, getQuestionResult } from './questionUtils';

interface RCSingleChoiceQuestionProps {
  question: Question;
  passage: Passage | null;
  passageId?: string;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export function RCSingleChoiceQuestion({
  question,
  passage,
  passageId,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
}: RCSingleChoiceQuestionProps) {
  const { submitAttempt, resetSubmission, progress } = useQuestionProgress(question.id, passageId);

  // Determine if this is a highlight question
  const isHighlight = question.question_type.toLowerCase().includes('highlight');

  // Extract and shuffle options (don't shuffle for highlight questions)
  const options = useMemo(() => getOptionsForBlank(question.choices, 1), [question.choices]);
  
  const shuffledOptions = useMemo(() => {
    if (isHighlight) {
      // Don't shuffle highlight questions (they reference specific lines)
      return options.map((option, index) => ({ option, originalIndex: index }));
    }
    return shuffleArray(options.map((option, index) => ({ option, originalIndex: index })));
  }, [options, isHighlight]);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset state when question changes
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

  // Check if selection is correct
  const isCorrect = isSubmitted && selectedOption !== null
    ? findChoiceByOption(question.choices, shuffledOptions[selectedOption].option)?.is_correct || false
    : false;

  const result = getQuestionResult(
    isSubmitted && selectedOption !== null,
    isCorrect,
    'Correct! You selected the right answer.',
    'Incorrect. Review the explanation below.'
  );

  const instructions = isHighlight
    ? 'Select the line that best answers the question.'
    : 'Select the answer choice that best answers the question.';

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Main Content - Split Layout */}
      <div className="flex-1 overflow-hidden flex gap-4">
        {/* Left Side - Passage */}
        <div className="w-1/2 flex flex-col">
          <PassageDisplay passage={passage} />
        </div>

        {/* Right Side - Question */}
        <div className="w-1/2 flex flex-col">
          <BaseQuestion
            question={question}
            progress={progress}
            result={result}
            instructions={instructions}
            onClear={handleReset}
            onSubmit={handleSubmit}
            submitDisabled={selectedOption === null || isSubmitted}
            onPrev={onPrev}
            onNext={onNext}
            hasPrev={hasPrev}
            hasNext={hasNext}
          >
            {/* Single column grid */}
            <div className="grid grid-cols-1 gap-1.5">
              {shuffledOptions.map(({ option }, shuffledIndex) => {
                const choice = findChoiceByOption(question.choices, option);
                
                return (
                  <OptionButton
                    key={shuffledIndex}
                    option={option}
                    choice={choice || null}
                    isSelected={selectedOption === shuffledIndex}
                    isCorrect={choice?.is_correct || false}
                    isSubmitted={isSubmitted}
                    onClick={() => handleOptionToggle(shuffledIndex)}
                  />
                );
              })}
            </div>
          </BaseQuestion>
        </div>
      </div>
    </div>
  );
}
