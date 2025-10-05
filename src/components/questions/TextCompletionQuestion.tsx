'use client';

import { useState, useMemo } from 'react';
import { Question } from '@/lib/api';
import { CheckCircle2, XCircle } from 'lucide-react';
import { QuestionFooter } from './QuestionFooter';
import { DifficultyBadge } from '../DifficultyBadge';
import { QuestionTypeBadge } from '../QuestionTypeBadge';
import { getOptionsForBlank, findChoiceByOption } from '@/lib/questionUtils';

interface TextCompletionQuestionProps {
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

export function TextCompletionQuestion({ question, onNext, onPrev, hasNext = false, hasPrev = false }: TextCompletionQuestionProps) {
  // Extract options from choices (TC single has only blank 1)
  const options = useMemo(() => 
    getOptionsForBlank(question.choices, 1), 
    [question.choices]
  );

  // Create shuffled options with original indices preserved
  const shuffledOptions = useMemo(() => {
    return shuffleArray(
      options.map((option, index) => ({ option, originalIndex: index }))
    );
  }, [options]); // Re-shuffle when question changes

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOptionToggle = (shuffledIndex: number) => {
    if (isSubmitted) return;
    setSelectedOption(shuffledIndex);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const getOptionStatus = (shuffledIndex: number) => {
    const { option: optionText } = shuffledOptions[shuffledIndex];
    
    // Find the choice for this option
    const choice = findChoiceByOption(question.choices, optionText);
    
    const isCorrect = choice?.is_correct || false;
    const isSelected = selectedOption === shuffledIndex;

    if (!isSubmitted) {
      return { isCorrect: false, isSelected, choice: null };
    }

    return { isCorrect, isSelected, choice };
  };

  const getResultMessage = () => {
    if (!isSubmitted || selectedOption === null) return null;

    const { option: optionText } = shuffledOptions[selectedOption];
    const choice = findChoiceByOption(question.choices, optionText);
    const isCorrect = choice?.is_correct || false;

    if (isCorrect) {
      return {
        type: 'success',
        message: 'Correct! You selected the right answer.',
      };
    } else {
      return {
        type: 'error',
        message: 'Incorrect. Review the explanation below.',
      };
    }
  };

  const result = getResultMessage();

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
          Select the answer choice that best completes the sentence.
        </p>

        {/* Question Text */}
        <div className="py-1.5">
          <p className="text-sm leading-normal">{question.question_text}</p>
        </div>

        {/* Result Message */}
        {result && (
          <div className={`border rounded-md p-2.5 ${
            result.type === 'success' 
              ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
              : 'border-red-500 bg-red-50 dark:bg-red-900/10'
          }`}>
            <div className="flex items-center gap-2">
              {result.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              )}
              <p className={`font-medium text-xs ${
                result.type === 'success' ? 'text-green-900 dark:text-green-300' : 'text-red-900 dark:text-red-300'
              }`}>
                {result.message}
              </p>
            </div>
          </div>
        )}

        {/* Options */}
        <div className="space-y-1.5">
          {shuffledOptions.map(({ option }, shuffledIndex) => {
            const status = getOptionStatus(shuffledIndex);
            const isCorrect = status.choice?.is_correct || false;
            const isSelected = status.isSelected;
            
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
                  <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
                    !isSubmitted
                      ? isSelected 
                        ? 'border-primary bg-primary' 
                        : 'border-muted-foreground'
                      : isSelected
                        ? isCorrect
                          ? 'border-green-600 bg-green-600'
                          : 'border-red-600 bg-red-600'
                        : 'border-muted-foreground'
                  }`}>
                    {isSelected && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{option}</p>
                    
                    {isSubmitted && isSelected && status.choice && (
                      <div className={`mt-1.5 p-2 rounded text-xs ${
                        isCorrect
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-900 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/20 text-red-900 dark:text-red-300'
                      }`}>
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
          })}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="flex-shrink-0 bg-background border-t pt-2.5">
        <QuestionFooter
          onClear={handleReset}
          onSubmit={handleSubmit}
          clearDisabled={!isSubmitted}
          submitDisabled={selectedOption === null || isSubmitted}
          onPrev={onPrev}
          onNext={onNext}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      </div>
    </div>
  );
}
