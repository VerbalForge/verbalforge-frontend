'use client';

import { useState, useMemo, useEffect } from 'react';
import { Question, Choice } from '@/lib/models/question';
import { Passage } from '@/lib/models/passage';
import { CheckCircle2, XCircle } from 'lucide-react';
import { PassageDisplay } from './PassageDisplay';
import { getOptionsForBlank, findChoiceByOption } from '@/lib/questionUtils';
import { useQuestionProgress } from '@/hooks/useQuestionProgress';
import { QuestionFooter } from './QuestionFooter';
import { DifficultyBadge } from '../DifficultyBadge';
import { QuestionTypeBadge } from '../QuestionTypeBadge';
import { Badge } from '@/components/ui/badge';
import { shuffleArray } from './questionUtils';

interface RCMultipleChoiceQuestionProps {
  question: Question;
  passage: Passage | null;
  passageId?: string;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export function RCMultipleChoiceQuestion({
  question,
  passage,
  passageId,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
}: RCMultipleChoiceQuestionProps) {
  const { submitAttempt, resetSubmission, progress } = useQuestionProgress(question.id, passageId);

  // Extract and shuffle options
  const options = useMemo(() => getOptionsForBlank(question.choices, 1), [question.choices]);
  
  const shuffledOptions = useMemo(() => {
    return shuffleArray(options.map((option, index) => ({ option, originalIndex: index })));
  }, [options]);

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
      newSelected.add(shuffledIndex);
    }
    setSelectedOptions(newSelected);
  };

  const handleSubmit = async () => {
    if (selectedOptions.size === 0) return;

    const selectedArray = Array.from(selectedOptions);
    const selectedChoices = selectedArray
      .map(shuffledIndex => {
        const { option: optionText } = shuffledOptions[shuffledIndex];
        return findChoiceByOption(question.choices, optionText);
      })
      .filter(Boolean) as Choice[];

    const allSelectedCorrect = selectedChoices.every(choice => choice?.is_correct);
    const correctChoices = question.choices.filter(c => c.is_correct);
    const selectedCorrectCount = selectedChoices.filter(c => c?.is_correct).length;

    const isCorrect = allSelectedCorrect && selectedCorrectCount === correctChoices.length;

    setIsSubmitted(true);
    await submitAttempt(isCorrect);
  };

  const handleReset = () => {
    setSelectedOptions(new Set());
    setIsSubmitted(false);
    resetSubmission();
  };

  // Calculate result with partial scoring support
  const result = (() => {
    if (!isSubmitted) return null;

    const selectedArray = Array.from(selectedOptions);
    const selectedChoices = selectedArray
      .map(shuffledIndex => {
        const { option: optionText } = shuffledOptions[shuffledIndex];
        return findChoiceByOption(question.choices, optionText);
      })
      .filter(Boolean) as Choice[];

    const allSelectedCorrect = selectedChoices.every(choice => choice?.is_correct);
    const correctChoices = question.choices.filter(c => c.is_correct);
    const selectedCorrectCount = selectedChoices.filter(c => c?.is_correct).length;

    // Perfect: All correct selected and no incorrect selected
    if (allSelectedCorrect && selectedCorrectCount === correctChoices.length) {
      return {
        type: 'success' as const,
        message: correctChoices.length === 1
          ? 'Correct! You selected the right answer.'
          : `Correct! You selected all ${correctChoices.length} correct answers.`,
      };
    }
    // Partial: Some correct but missed some
    else if (allSelectedCorrect && selectedCorrectCount < correctChoices.length) {
      return {
        type: 'partial' as const,
        message: `Partially correct. You selected ${selectedCorrectCount} of ${correctChoices.length} correct answers.`,
      };
    }
    // Wrong: Selected some correct but also incorrect ones
    else if (!allSelectedCorrect && selectedCorrectCount > 0) {
      return {
        type: 'error' as const,
        message: 'Incorrect. You selected some correct answers but also included incorrect ones.',
      };
    }
    // All wrong
    else {
      return {
        type: 'error' as const,
        message: 'Incorrect. Review the explanations below.',
      };
    }
  })();

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Main Content - Split Layout */}
      <div className="flex-1 overflow-hidden flex gap-4">
        {/* Left Side - Passage */}
        <div className="w-1/2 flex flex-col">
          <PassageDisplay passage={passage} />
        </div>

        {/* Right Side - Question */}
        <div className="w-1/2 flex flex-col overflow-y-auto pr-2">
          <div className="space-y-2.5">
            {/* Question Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <QuestionTypeBadge type={question.question_type} />
              <DifficultyBadge difficulty={question.difficulty_level} />
              {progress?.solved && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Solved
                </Badge>
              )}
              {progress?.attempted && !progress?.solved && (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
                  Attempted
                </Badge>
              )}
            </div>

            {/* Instructions */}
            <p className="text-xs text-muted-foreground">
              Select all answer choices that apply.
            </p>

            {/* Question Text */}
            <div className="py-1.5">
              <p className="text-sm leading-normal font-medium">{question.question_text}</p>
            </div>

            {/* Result Message */}
            {result && (
              <div
                className={`border rounded-md p-2.5 ${
                  result.type === 'success'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                    : result.type === 'partial'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  {result.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  )}
                  <p
                    className={`font-medium text-xs ${
                      result.type === 'success'
                        ? 'text-green-900 dark:text-green-300'
                        : result.type === 'partial'
                        ? 'text-yellow-900 dark:text-yellow-300'
                        : 'text-red-900 dark:text-red-300'
                    }`}
                  >
                    {result.message}
                  </p>
                </div>
              </div>
            )}

            {/* Options - Checkbox style for multiple selection */}
            <div className="space-y-1.5">
              {shuffledOptions.map(({ option }, shuffledIndex) => {
                const choice = findChoiceByOption(question.choices, option);
                const isSelected = selectedOptions.has(shuffledIndex);
                const isCorrect = choice?.is_correct || false;

                return (
                  <div
                    key={shuffledIndex}
                    className={`border rounded-md p-2.5 cursor-pointer transition-all ${
                      !isSubmitted
                        ? isSelected
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-primary/50 border-border'
                        : isSelected
                        ? isCorrect
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                          : 'border-red-500 bg-red-50 dark:bg-red-900/10'
                        : 'border-border'
                    }`}
                    onClick={() => handleOptionToggle(shuffledIndex)}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Checkbox indicator (square for multi-select) */}
                      <div
                        className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${
                          !isSubmitted
                            ? isSelected
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground'
                            : isSelected
                            ? isCorrect
                              ? 'border-green-600 bg-green-600'
                              : 'border-red-600 bg-red-600'
                            : 'border-muted-foreground'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{option}</p>

                        {isSubmitted && isSelected && choice && (
                          <div
                            className={`mt-1.5 p-2 rounded text-xs ${
                              isCorrect
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-900 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-900/20 text-red-900 dark:text-red-300'
                            }`}
                          >
                            <p className="font-medium mb-0.5 flex items-center gap-1">
                              {isCorrect ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3" />
                                  Correct
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3" />
                                  Incorrect
                                </>
                              )}
                            </p>
                            <p className="leading-snug">{choice.reasoning}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="flex-shrink-0 bg-background border-t pt-2.5 mt-2.5">
        <QuestionFooter
          onClear={handleReset}
          onSubmit={handleSubmit}
          clearDisabled={false}
          submitDisabled={selectedOptions.size === 0 || isSubmitted}
          onPrev={onPrev}
          onNext={onNext}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      </div>
    </div>
  );
}
