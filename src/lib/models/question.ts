export interface Choice {
  option: string;
  blank: number;
  is_correct: boolean;
  reasoning: string;
}

export interface QuestionMetadata {
  created_at: string;
  updated_at: string;
  published_at: string;
  batch_id: string;
}

export interface Question {
  id: string;
  question_type: string;
  difficulty_level: string;
  topic: string;
  question_text: string;
  passage_id?: string;
  choices: Choice[];
  metadata: QuestionMetadata;
}

export interface PartialQuestion {
  id: string;
  question_type: string;
  difficulty_level: string;
  topic: string;
  question_text: string;
  created_at: string;
}

export interface QuestionsResponse {
  questions: PartialQuestion[];
  total: number;
  limit: number;
  nextCursor?: string;
  previousCursor?: string;
  hasMore: boolean;
}

export interface UserQuestionProgress {
  id?: string;
  userId: string;
  questionId: string;
  solved: boolean;
  attempted: boolean;
  lastAttemptAt: string;
  lastSolvedAt?: string;
  timeTaken: number;
  difficulty_level: string;
  question_type: string;
  xpGained: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitQuestionAttemptRequest {
  solved: boolean;
  timeTaken: number;
}
