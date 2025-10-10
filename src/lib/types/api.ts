// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Common API parameters
export interface PaginationParams {
  limit?: number;
  cursor?: string;
}

export interface QuestionFilters extends PaginationParams {
  difficulty?: string;
  type?: string;
  topic?: string;
  new?: boolean;
}

export interface PassageFilters extends PaginationParams {
  difficulty?: string;
  new?: boolean;
}

export interface DiscussionFilters extends PaginationParams {
  sortBy?: 'newest' | 'oldest' | 'popular' | 'views' | 'updated';
  tags?: string[];
}

export interface SearchParams extends PaginationParams {
  q: string;
}
