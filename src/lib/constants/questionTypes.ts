export type QuestionType = 'SE' | 'TC-1' | 'TC-2' | 'TC-3' | 'RC-1' | 'RC-highlight' | 'RC-multi';

// Mapping between database question types and our internal types
export const DB_TO_DIALOG_TYPE: Record<string, QuestionType> = {
  'sentence_equivalence': 'SE',
  'text_completion_single': 'TC-1',
  'text_completion_double': 'TC-2',
  'text_completion_triple': 'TC-3',
  'reading_comprehension_single': 'RC-1',
  'reading_comprehension_highlight': 'RC-highlight',
  'reading_comprehension_multiple': 'RC-multi',
};

export const DIALOG_TO_DB_TYPE: Record<QuestionType, string> = {
  'SE': 'sentence_equivalence',
  'TC-1': 'text_completion_single',
  'TC-2': 'text_completion_double',
  'TC-3': 'text_completion_triple',
  'RC-1': 'reading_comprehension_single',
  'RC-highlight': 'reading_comprehension_highlight',
  'RC-multi': 'reading_comprehension_multiple',
};

export interface QuestionTypeConfig {
  label: string;
  totalOptions: number;
  correctCount: number | string;
  blanks: number;
}

export const QUESTION_TYPE_CONFIGS: Record<QuestionType, QuestionTypeConfig> = {
  'SE': { label: 'Sentence Equivalence', totalOptions: 6, correctCount: 2, blanks: 0 },
  'TC-1': { label: 'Text Completion (1 Blank)', totalOptions: 5, correctCount: 1, blanks: 1 },
  'TC-2': { label: 'Text Completion (2 Blanks)', totalOptions: 6, correctCount: 2, blanks: 2 },
  'TC-3': { label: 'Text Completion (3 Blanks)', totalOptions: 9, correctCount: 3, blanks: 3 },
  'RC-1': { label: 'Reading Comp (Single)', totalOptions: 5, correctCount: 1, blanks: 0 },
  'RC-highlight': { label: 'Reading Comp (Highlight)', totalOptions: 4, correctCount: 1, blanks: 0 },
  'RC-multi': { label: 'Reading Comp (Multiple)', totalOptions: 3, correctCount: '1-3', blanks: 0 },
};
