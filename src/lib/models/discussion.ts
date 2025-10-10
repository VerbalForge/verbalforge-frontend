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

export interface Discussion {
  id: string;
  title: string;
  description: string;
  questionIds: string[];
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
  questionIds?: string[];
  tags?: string[];
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
