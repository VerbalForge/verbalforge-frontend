'use client';

import { useState, useMemo, useEffect } from 'react';
import { Question, Passage } from '@/lib/api';
import { CheckCircle2, XCircle } from 'lucide-react';
import { QuestionFooter } from './QuestionFooter';
import { DifficultyBadge } from '../DifficultyBadge';
import { QuestionTypeBadge } from '../QuestionTypeBadge';
import { getOptionsForBlank, findChoiceByOption } from '@/lib/questionUtils';
import { PassageDisplay } from './PassageDisplay';
import { apiService } from '@/lib/api';

interface ReadingComprehensionQuestionProps {
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

export function ReadingComprehensionQuestion({ 
  question, 
  onNext, 
  onPrev, 
  hasNext = false, 
  hasPrev = false 
}: ReadingComprehensionQuestionProps) {
  const [passage, setPassage] = useState<Passage | null>(null);
  const [loadingPassage, setLoadingPassage] = useState(true);
  const [passageError, setPassageError] = useState<string | null>(null);

  // Determine if this is a single or multiple selection question
  const questionTypeLower = question.question_type.toLowerCase();
  const isMultipleSelection = questionTypeLower.includes('multiple');
  const isHighlight = questionTypeLower.includes('highlight');

  // Extract options from choices (RC questions typically use blank 1)
  const options = useMemo(() => 
    getOptionsForBlank(question.choices, 1), 
    [question.choices]
  );

  // Create shuffled options with original indices preserved
  // For highlight questions, don't shuffle as they reference specific lines
  const shuffledOptions = useMemo(() => {
    if (isHighlight) {
      return options.map((option, index) => ({ option, originalIndex: index }));
    }
    return shuffleArray(
      options.map((option, index) => ({ option, originalIndex: index }))
    );
  }, [options, isHighlight]);

  const [selectedOptions, setSelectedOptions] = useState<Set<number>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch passage when component mounts
  useEffect(() => {
    const fetchPassage = async () => {
      // Debug logging
      console.log('Question object:', question);
      console.log('Passage ID:', question.passage_id);
      console.log('Question ID:', question.question_id);
      console.log('Question Type:', question.question_type);
      
      if (!question.passage_id) {
        console.error('Missing passage_id in question object');
        setPassageError('No passage ID in question data. The question may need to be updated to the new schema.');
        setLoadingPassage(false);
        return;
      }

      try {
        setLoadingPassage(true);
        console.log('Fetching passage with ID:', question.passage_id);
        const fetchedPassage = await apiService.getPassageById(question.passage_id);
        console.log('Fetched passage:', fetchedPassage);
        setPassage(fetchedPassage);
        setPassageError(null);
      } catch (error) {
        console.error('Error fetching passage:', error);
        setPassageError(`Failed to load passage: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoadingPassage(false);
      }
    };

    fetchPassage();
  }, [question]);

  const handleOptionToggle = (shuffledIndex: number) => {
    if (isSubmitted) return;

    const newSelected = new Set(selectedOptions);
    if (newSelected.has(shuffledIndex)) {
      newSelected.delete(shuffledIndex);
    } else {
      if (isMultipleSelection) {
        newSelected.add(shuffledIndex);
      } else {
        // Single selection - clear others
        newSelected.clear();
        newSelected.add(shuffledIndex);
      }
    }
    setSelectedOptions(newSelected);
  };

  const handleSubmit = () => {
    if (selectedOptions.size === 0) return;
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedOptions(new Set());
    setIsSubmitted(false);
  };

  const getOptionStatus = (shuffledIndex: number) => {
    const { option: optionText } = shuffledOptions[shuffledIndex];
    
    // Find the choice for this option
    const choice = findChoiceByOption(question.choices, optionText);
    
    const isCorrect = choice?.is_correct || false;
    const isSelected = selectedOptions.has(shuffledIndex);

    if (!isSubmitted) {
      return { isCorrect: false, isSelected, choice: null };
    }

    return { isCorrect, isSelected, choice };
  };

  const getResultMessage = () => {
    if (!isSubmitted) return null;

    const selectedArray = Array.from(selectedOptions);
    
    if (isMultipleSelection) {
      // Multiple selection: Can have 1 to all answers correct
      // Need to select ALL correct answers and ONLY correct answers
      const selectedChoices = selectedArray.map(shuffledIndex => {
        const { option: optionText } = shuffledOptions[shuffledIndex];
        return findChoiceByOption(question.choices, optionText);
      }).filter(Boolean);

      const allSelectedCorrect = selectedChoices.every(choice => choice?.is_correct);
      const correctChoices = question.choices.filter(c => c.is_correct);
      const selectedCorrectCount = selectedChoices.filter(c => c?.is_correct).length;
      
      // Perfect: All correct selected and no incorrect selected
      if (allSelectedCorrect && selectedCorrectCount === correctChoices.length) {
        return {
          type: 'success',
          message: correctChoices.length === 1 
            ? 'Correct! You selected the right answer.'
            : `Correct! You selected all ${correctChoices.length} correct answers.`,
        };
      } 
      // Partial: Some correct but missed some or included incorrect
      else if (selectedCorrectCount > 0 && selectedCorrectCount < correctChoices.length) {
        return {
          type: 'partial',
          message: `Partially correct. You selected ${selectedCorrectCount} of ${correctChoices.length} correct answers.`,
        };
      }
      // Wrong: Selected some correct but also incorrect ones
      else if (allSelectedCorrect === false && selectedCorrectCount > 0) {
        return {
          type: 'error',
          message: 'Incorrect. You selected some correct answers but also included incorrect ones.',
        };
      }
      // All wrong
      else {
        return {
          type: 'error',
          message: 'Incorrect. Review the explanations below.',
        };
      }
    } else {
      // Single selection (includes highlight): Only one correct answer
      if (selectedArray.length === 0) return null;
      
      const { option: optionText } = shuffledOptions[selectedArray[0]];
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
    }
  };

  const result = getResultMessage();

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Main Content - Split Layout */}
      <div className="flex-1 overflow-hidden flex gap-4">
        {/* Left Side - Passage */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-shrink-0 mb-2">
            <h3 className="text-sm font-semibold text-foreground">Passage</h3>
          </div>
          <PassageDisplay 
            passage={passage}
            loading={loadingPassage}
            error={passageError}
            isHighlight={isHighlight}
          />
        </div>

        {/* Right Side - Question */}
        <div className="w-1/2 flex flex-col overflow-y-auto pr-2">
          <div className="space-y-2.5">
            {/* Question Header */}
            <div className="flex items-center gap-2">
              <QuestionTypeBadge type={question.question_type} />
              <DifficultyBadge difficulty={question.difficulty_level} />
            </div>

            {/* Instructions */}
            <p className="text-xs text-muted-foreground">
              {isMultipleSelection 
                ? 'Select all answer choices that apply.'
                : isHighlight
                  ? 'Select the line that best answers the question.'
                  : 'Select the answer choice that best answers the question.'}
            </p>

            {/* Question Text */}
            <div className="py-1.5">
              <p className="text-sm leading-normal font-medium">{question.question_text}</p>
            </div>

            {/* Result Message */}
            {result && (
              <div className={`border rounded-md p-2.5 ${
                result.type === 'success' 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                  : result.type === 'partial'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/10'
              }`}>
                <div className="flex items-center gap-2">
                  {result.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  )}
                  <p className={`font-medium text-xs ${
                    result.type === 'success' 
                      ? 'text-green-900 dark:text-green-300'
                      : result.type === 'partial'
                        ? 'text-yellow-900 dark:text-yellow-300'
                        : 'text-red-900 dark:text-red-300'
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
                      <div className={`flex-shrink-0 w-4 h-4 ${
                        isMultipleSelection ? 'rounded' : 'rounded-full'
                      } border-2 flex items-center justify-center mt-0.5 transition-colors ${
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
                          <div className={`w-1.5 h-1.5 bg-white ${
                            isMultipleSelection ? 'rounded-sm' : 'rounded-full'
                          }`} />
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
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="flex-shrink-0 bg-background border-t pt-2.5 mt-2.5">
        <QuestionFooter
          onClear={handleReset}
          onSubmit={handleSubmit}
          clearDisabled={!isSubmitted}
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
