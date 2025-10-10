// Question Types
export enum QuestionType {
  TC_1_BLANK = 'TC-1-blank',
  TC_2_BLANK = 'TC-2-blank',
  TC_3_BLANK = 'TC-3-blank',
  SE = 'SE',
  RC_1_BLANK = 'RC-1-blank',
  RC_2_BLANK = 'RC-2-blank',
  RC_HIGHLIGHT = 'RC-highlight',
}

// Difficulty Levels
export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

// Sort Options for Discussions
export enum DiscussionSortBy {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  POPULAR = 'popular',
  VIEWS = 'views',
  UPDATED = 'updated',
}

// Activity Level (for GitHub-style calendar)
export enum ActivityLevel {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  VERY_HIGH = 4,
}

// Question type display names
export const QuestionTypeLabels: Record<QuestionType, string> = {
  [QuestionType.TC_1_BLANK]: 'Text Completion (1 Blank)',
  [QuestionType.TC_2_BLANK]: 'Text Completion (2 Blanks)',
  [QuestionType.TC_3_BLANK]: 'Text Completion (3 Blanks)',
  [QuestionType.SE]: 'Sentence Equivalence',
  [QuestionType.RC_1_BLANK]: 'Reading Comprehension (1 Blank)',
  [QuestionType.RC_2_BLANK]: 'Reading Comprehension (2 Blanks)',
  [QuestionType.RC_HIGHLIGHT]: 'Reading Comprehension (Highlight)',
};

// Difficulty colors for UI
export const DifficultyColors: Record<DifficultyLevel, string> = {
  [DifficultyLevel.EASY]: 'green',
  [DifficultyLevel.MEDIUM]: 'yellow',
  [DifficultyLevel.HARD]: 'red',
};
