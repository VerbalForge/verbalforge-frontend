'use client';

import { useState, useMemo } from 'react';
import { Question } from '@/lib/api';
import { CheckCircle2, XCircle } from 'lucide-react';
import { QuestionFooter } from './QuestionFooter';
import { DifficultyBadge } from '../DifficultyBadge';
import { QuestionTypeBadge } from '../QuestionTypeBadge';
import { getOptionsForBlank, findChoiceByOption } from '@/lib/questionUtils';

interface TextCompletionTripleQuestionProps {
  question: Question;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function TextCompletionTripleQuestion({ question, onNext, onPrev, hasNext = false, hasPrev = false }: TextCompletionTripleQuestionProps) {
  // Extract options from choices
  const blank1Options = useMemo(() => 
    getOptionsForBlank(question.choices, 1), 
    [question.choices]
  );

  const blank2Options = useMemo(() => 
    getOptionsForBlank(question.choices, 2), 
    [question.choices]
  );

  const blank3Options = useMemo(() => 
    getOptionsForBlank(question.choices, 3), 
    [question.choices]
  );

  // Shuffle each blank's options independently
  const shuffledBlank1 = useMemo(() => {
    return shuffleArray(
      blank1Options.map((option, index) => ({ option, originalIndex: index }))
    );
  }, [blank1Options]);

  const shuffledBlank2 = useMemo(() => {
    return shuffleArray(
      blank2Options.map((option, index) => ({ option, originalIndex: index }))
    );
  }, [blank2Options]);

  const shuffledBlank3 = useMemo(() => {
    return shuffleArray(
      blank3Options.map((option, index) => ({ option, originalIndex: index }))
    );
  }, [blank3Options]);

  const [selectedBlank1, setSelectedBlank1] = useState<number | null>(null);
  const [selectedBlank2, setSelectedBlank2] = useState<number | null>(null);
  const [selectedBlank3, setSelectedBlank3] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleBlank1Toggle = (shuffledIndex: number) => {
    if (isSubmitted) return;
    setSelectedBlank1(shuffledIndex);
  };

  const handleBlank2Toggle = (shuffledIndex: number) => {
    if (isSubmitted) return;
    setSelectedBlank2(shuffledIndex);
  };

  const handleBlank3Toggle = (shuffledIndex: number) => {
    if (isSubmitted) return;
    setSelectedBlank3(shuffledIndex);
  };

  const handleSubmit = () => {
    if (selectedBlank1 === null || selectedBlank2 === null || selectedBlank3 === null) return;
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedBlank1(null);
    setSelectedBlank2(null);
    setSelectedBlank3(null);
    setIsSubmitted(false);
  };

  const getOptionStatus = (shuffledIndex: number, blankNumber: 1 | 2 | 3) => {
    const shuffledOptions = blankNumber === 1 ? shuffledBlank1 : blankNumber === 2 ? shuffledBlank2 : shuffledBlank3;
    const selectedIndex = blankNumber === 1 ? selectedBlank1 : blankNumber === 2 ? selectedBlank2 : selectedBlank3;
    
    const { option: optionText } = shuffledOptions[shuffledIndex];
    
    // Find choice for this option
    const choice = findChoiceByOption(question.choices, optionText);
    
    const isCorrect = choice?.is_correct || false;
    const isSelected = selectedIndex === shuffledIndex;

    if (!isSubmitted) {
      return { isCorrect: false, isSelected, choice: null };
    }

    return { isCorrect, isSelected, choice };
  };

  const getResultMessage = () => {
    if (!isSubmitted || selectedBlank1 === null || selectedBlank2 === null || selectedBlank3 === null) return null;

    const blank1Option = shuffledBlank1[selectedBlank1].option;
    const blank2Option = shuffledBlank2[selectedBlank2].option;
    const blank3Option = shuffledBlank3[selectedBlank3].option;
    
    const blank1Choice = findChoiceByOption(question.choices, blank1Option);
    const blank2Choice = findChoiceByOption(question.choices, blank2Option);
    const blank3Choice = findChoiceByOption(question.choices, blank3Option);
    
    const blank1Correct = blank1Choice?.is_correct || false;
    const blank2Correct = blank2Choice?.is_correct || false;
    const blank3Correct = blank3Choice?.is_correct || false;

    const correctCount = [blank1Correct, blank2Correct, blank3Correct].filter(Boolean).length;

    if (correctCount === 3) {
      return {
        type: 'success',
        message: 'Perfect! You selected all three correct answers.',
      };
    } else if (correctCount > 0) {
      return {
        type: 'partial',
        message: `${correctCount} out of 3 answers are correct.`,
      };
    } else {
      return {
        type: 'error',
        message: 'Incorrect. Review the explanations below.',
      };
    }
  };

  const result = getResultMessage();

  const renderOption = (
    shuffledOptions: Array<{ option: string; originalIndex: number }>,
    shuffledIndex: number,
    blankNumber: 1 | 2 | 3
  ) => {
    const { option } = shuffledOptions[shuffledIndex];
    const status = getOptionStatus(shuffledIndex, blankNumber);
    const isCorrect = status.choice?.is_correct || false;
    const isSelected = status.isSelected;

    return (
      <div
        key={`blank${blankNumber}-${shuffledIndex}`}
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
        onClick={() => {
          if (blankNumber === 1) handleBlank1Toggle(shuffledIndex);
          else if (blankNumber === 2) handleBlank2Toggle(shuffledIndex);
          else handleBlank3Toggle(shuffledIndex);
        }}
      >
        <div className="flex items-start gap-2.5">
          <div
            className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
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
            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm">{option}</p>

            {isSubmitted && isSelected && status.choice && (
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
                <p className="leading-snug">{status.choice.reasoning}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-2">
        {/* Question Header */}
        <div className="flex items-center gap-2">
          <QuestionTypeBadge type={question.question_type} />
          <DifficultyBadge difficulty={question.difficulty_level} />
        </div>

        {/* Instructions */}
        <p className="text-xs text-muted-foreground">
          Select one answer choice for each blank to complete the sentence.
        </p>

        {/* Question Text */}
        <div className="py-1.5">
          <p className="text-sm leading-normal">{question.question_text}</p>
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

        {/* Blank Headers and Options Grid */}
        <div className="space-y-1.5">
          {/* Headers */}
          <div className="grid grid-cols-3 gap-x-3">
            <p className="text-sm font-medium text-foreground">Blank 1:</p>
            <p className="text-sm font-medium text-foreground">Blank 2:</p>
            <p className="text-sm font-medium text-foreground">Blank 3:</p>
          </div>

          {/* Options Grid - 3 rows, 3 columns */}
          <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
            {/* Row 1 */}
            {renderOption(shuffledBlank1, 0, 1)}
            {renderOption(shuffledBlank2, 0, 2)}
            {renderOption(shuffledBlank3, 0, 3)}
            
            {/* Row 2 */}
            {renderOption(shuffledBlank1, 1, 1)}
            {renderOption(shuffledBlank2, 1, 2)}
            {renderOption(shuffledBlank3, 1, 3)}
            
            {/* Row 3 */}
            {renderOption(shuffledBlank1, 2, 1)}
            {renderOption(shuffledBlank2, 2, 2)}
            {renderOption(shuffledBlank3, 2, 3)}
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="flex-shrink-0 bg-background border-t pt-2.5">
        <QuestionFooter
          onClear={handleReset}
          onSubmit={handleSubmit}
          clearDisabled={!isSubmitted}
          submitDisabled={selectedBlank1 === null || selectedBlank2 === null || selectedBlank3 === null || isSubmitted}
          onPrev={onPrev}
          onNext={onNext}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      </div>
    </div>
  );
}
