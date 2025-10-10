export interface PassageMetadata {
  created_at: string;
  updated_at: string;
  published_at: string;
  batch_id: string;
}

export interface Passage {
  id: string;
  passage: string;
  source: string;
  title: string;
  difficulty: string;
  type: string;
  question_ids: string[];
  metadata: PassageMetadata;
}

export interface PartialPassage {
  id: string;
  passage: string;
  title: string;
  difficulty: string;
  question_ids: string[];
  created_at: string;
}

export interface PassagesResponse {
  passages: PartialPassage[];
  total: number;
  limit: number;
  nextCursor?: string;
  previousCursor?: string;
  hasMore: boolean;
}

export interface UserPassageProgress {
  passageId: string;
  solvedQuestionIds: string[];
  totalQuestions: number;
  solved: boolean;
  attempted: boolean;
}

export interface SubmitPassageAttemptRequest {
  questionAttempts: {
    questionId: string;
    solved: boolean;
    timeTaken: number;
  }[];
}
