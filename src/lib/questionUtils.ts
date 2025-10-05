import { Question, Choice } from './api';

/**
 * Helper functions to work with the new choice-based question structure
 */

/**
 * Gets options for a specific blank from choices array
 */
export function getOptionsForBlank(choices: Choice[], blankNumber: number): string[] {
  return choices
    .filter(choice => choice.blank === blankNumber)
    .map(choice => choice.option);
}

/**
 * Gets all options grouped by blank number
 * Returns an array where index represents blank number (1-indexed converted to 0-indexed)
 */
export function getOptionsGroupedByBlank(choices: Choice[]): string[][] {
  const maxBlank = Math.max(...choices.map(c => c.blank), 1);
  const grouped: string[][] = [];
  
  for (let i = 1; i <= maxBlank; i++) {
    grouped.push(getOptionsForBlank(choices, i));
  }
  
  return grouped;
}

/**
 * Gets correct answers for all blanks
 */
export function getCorrectAnswers(choices: Choice[]): string[] {
  return choices
    .filter(choice => choice.is_correct)
    .sort((a, b) => a.blank - b.blank)
    .map(choice => choice.option);
}

/**
 * Finds a choice by option text (case-insensitive)
 */
export function findChoiceByOption(choices: Choice[], optionText: string): Choice | undefined {
  const normalized = optionText.trim().toLowerCase();
  return choices.find(choice => 
    choice.option.trim().toLowerCase() === normalized
  );
}

/**
 * Checks if an option is correct
 */
export function isOptionCorrect(choices: Choice[], optionText: string): boolean {
  const choice = findChoiceByOption(choices, optionText);
  return choice?.is_correct || false;
}

/**
 * Gets reasoning for an option
 */
export function getReasoningForOption(choices: Choice[], optionText: string): string {
  const choice = findChoiceByOption(choices, optionText);
  return choice?.reasoning || '';
}

/**
 * Gets the blank number for an option
 */
export function getBlankForOption(choices: Choice[], optionText: string): number {
  const choice = findChoiceByOption(choices, optionText);
  return choice?.blank || 1;
}

/**
 * Converts choices to legacy format for backward compatibility
 * Used by components that expect the old options/justification structure
 */
export function choicesToLegacyFormat(choices: Choice[]): {
  options: string[][];
  justifications: Array<{ option: string; is_correct: boolean; reasoning: string }>[];
} {
  const grouped = getOptionsGroupedByBlank(choices);
  const justifications = grouped.map((_, blankIndex) => {
    const blankNumber = blankIndex + 1;
    return choices
      .filter(c => c.blank === blankNumber)
      .map(c => ({
        option: c.option,
        is_correct: c.is_correct,
        reasoning: c.reasoning
      }));
  });
  
  return { options: grouped, justifications };
}

/**
 * Determines the number of blanks in a question
 */
export function getBlankCount(choices: Choice[]): number {
  if (choices.length === 0) return 0;
  return Math.max(...choices.map(c => c.blank));
}

/**
 * Gets question type-specific information
 */
export function getQuestionTypeInfo(question: Question): {
  isSentenceEquivalence: boolean;
  isTextCompletion: boolean;
  isReadingComprehension: boolean;
  blankCount: number;
} {
  const type = question.question_type.toLowerCase();
  
  return {
    isSentenceEquivalence: type.includes('sentence_equivalence'),
    isTextCompletion: type.includes('text_completion'),
    isReadingComprehension: type.includes('reading_comprehension'),
    blankCount: getBlankCount(question.choices),
  };
}
