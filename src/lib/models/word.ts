export interface WordMeaning {
  definition: string;
  examples: string[];
}

export interface Word {
  id: string;
  word: string;
  pronunciation?: string;
  meanings: WordMeaning[];
  sources: string[];
  synonyms: string[];
  antonyms: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WordFilters {
  sources?: string[];
  search?: string;
  limit?: number;
  page?: number;
  known?: boolean;
  practice?: boolean;
}

export interface WordsResponse {
  words: Word[];
  total: number;
  sources: string[]; // Available sources for filtering
  hasMore: boolean;
  page: number;
  totalPages: number;
  limit: number;
}