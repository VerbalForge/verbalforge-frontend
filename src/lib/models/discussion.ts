export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export type DiscussionType = 'general' | 'question_linked';

export interface LinkedQuestion {
  questionId: string;
  passageId?: string;
  questionText: string;
  questionType: string;
  difficultyLevel: string;
  passageTitle?: string;
}

export interface Discussion {
  id: string;
  title: string;
  description: string;
  questionIds: string[]; // Deprecated, kept for backward compatibility
  discussionType: DiscussionType;
  linkedQuestion?: LinkedQuestion;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  views: number;
  viewedBy: string[];
  likes: number;
  likedBy: string[];
  tags: string[];
  isPinned: boolean;
  isLocked: boolean;
  commentCount: number;
}

export interface DiscussionsResponse {
  discussions: Discussion[];
  total: number;
  limit: number;
  nextCursor?: string;
  previousCursor?: string;
  hasMore: boolean;
}

export interface CreateDiscussionRequest {
  title: string;
  description: string;
  questionIds?: string[]; // Deprecated
  tags?: string[];
  questionId?: string; // Optional: if provided, creates a question-linked discussion
}

export interface UpdateDiscussionRequest {
  title?: string;
  description?: string;
  questionIds?: string[];
  tags?: string[];
}

export interface CreateCommentRequest {
  text: string;
}

export interface UpdateCommentRequest {
  text: string;
}
