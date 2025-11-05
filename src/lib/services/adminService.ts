import { httpClient } from '../api/httpClient';
import { Question, Passage } from '../models';

// ============= TYPES =============

// Admin versions use the same structure but may have null publishedAt
export type AdminQuestion = Question;
export type AdminPassage = Passage;

export interface AdminQuestionsResponse {
  questions: AdminQuestion[];
  total: number;
  hasMore: boolean;
}

export interface AdminPassagesResponse {
  passages: AdminPassage[];
  total: number;
  hasMore: boolean;
}

export interface AdminDiscussion {
  id: string;
  userId: string;
  username?: string;
  questionId?: string;
  passageId?: string;
  questionTitle?: string;
  passageTitle?: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDiscussionsResponse {
  discussions: AdminDiscussion[];
  total: number;
}

export interface UserActivityLog {
  id: string;
  userId: string;
  activityType: string; // TC, SE, RC
  questionId?: string;
  passageId?: string;
  isCorrect: boolean;
  attemptNumber: number;
  timeSpent: number;
  timestamp: string;
}

export interface UserActivityLogsResponse {
  activities: UserActivityLog[];
  total: number;
}

export interface UserAggregatedStats {
  user_id: string;
  username: string;
  email: string;
  total_attempted: number;
  accuracy_rate: number;
  most_attempted_type: string;
  type_breakdown: {
    [key: string]: { attempted: number; correct: number };
  };
}

export interface QuestionFilters {
  published?: boolean;
  type?: string;
  difficulty?: string;
  search?: string;
  limit?: number;
  skip?: number;
}

export interface PassageFilters {
  published?: boolean;
  difficulty?: string;
  search?: string;
  limit?: number;
  skip?: number;
}

export interface ActivityFilters {
  type?: string; // TC, SE, RC
  startDate?: string;
  endDate?: string;
  limit?: number;
  skip?: number;
}

export interface AdminStatsResponse {
  questions: {
    total: number;
    published: number;
    unpublished: number;
  };
  passages: {
    total: number;
    published: number;
    unpublished: number;
  };
  users: {
    total: number;
  };
  discussions: {
    total: number;
  };
}

export interface Word {
  id: string;
  word: string;
  meanings: WordMeaning[];
  tags?: string[];
  sources?: string[];
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
  pronunciation?: string;
  difficulty?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WordMeaning {
  partOfSpeech: string; // noun, verb, adjective, etc.
  definition: string;
  example?: string;
}

export interface WordFilters {
  search?: string;
  difficulty?: string;
  sources?: string[];
  limit?: number;
  skip?: number;
}

export interface AdminWordsResponse {
  words: Word[];
  total: number;
  hasMore: boolean;
}

export interface BulkOperationResponse {
  success: boolean;
  count: number;
  message?: string;
}

// ============= SERVICE =============

export class AdminService {
  // ========== QUESTIONS ==========
  
  async getQuestions(filters?: QuestionFilters): Promise<AdminQuestionsResponse> {
    const params = new URLSearchParams();
    
    if (filters?.published !== undefined) params.append('published', String(filters.published));
    if (filters?.type) params.append('type', filters.type);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit && filters.limit > 0) params.append('limit', String(Math.floor(filters.limit)));
    if (filters?.skip && filters.skip >= 0) params.append('skip', String(Math.floor(filters.skip)));

    const url = `/admin/questions${params.toString() ? '?' + params.toString() : ''}`;
    return httpClient.get<AdminQuestionsResponse>(url);
  }

  async getQuestionById(id: string): Promise<AdminQuestion> {
    return httpClient.get<AdminQuestion>(`/admin/questions/${id}`);
  }

  async createQuestion(data: Partial<AdminQuestion>): Promise<AdminQuestion> {
    return httpClient.post<AdminQuestion>('/admin/questions', data);
  }

  async updateQuestion(id: string, data: Partial<AdminQuestion>): Promise<AdminQuestion> {
    return httpClient.put<AdminQuestion>(`/admin/questions/${id}`, data);
  }

  async deleteQuestion(id: string): Promise<void> {
    return httpClient.delete(`/admin/questions/${id}`);
  }

  async publishQuestion(id: string, publish: boolean): Promise<AdminQuestion> {
    return httpClient.patch<AdminQuestion>(`/admin/questions/${id}/publish`, { publish });
  }

  async bulkDeleteQuestions(questionIds: string[]): Promise<BulkOperationResponse> {
    return httpClient.post<BulkOperationResponse>('/admin/questions/bulk-delete', { 
      question_ids: questionIds 
    });
  }

  async bulkPublishQuestions(questionIds: string[], publish: boolean): Promise<BulkOperationResponse> {
    return httpClient.post<BulkOperationResponse>('/admin/questions/bulk-publish', { 
      question_ids: questionIds,
      publish 
    });
  }

  // ========== PASSAGES ==========
  
  async getPassages(filters?: PassageFilters): Promise<AdminPassagesResponse> {
    const params = new URLSearchParams();
    
    if (filters?.published !== undefined) params.append('published', String(filters.published));
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit && filters.limit > 0) params.append('limit', String(Math.floor(filters.limit)));
    if (filters?.skip && filters.skip >= 0) params.append('skip', String(Math.floor(filters.skip)));

    const url = `/admin/passages${params.toString() ? '?' + params.toString() : ''}`;
    return httpClient.get<AdminPassagesResponse>(url);
  }

  async getPassageById(id: string): Promise<AdminPassage> {
    return httpClient.get<AdminPassage>(`/admin/passages/${id}`);
  }

  async createPassage(data: Partial<AdminPassage>): Promise<AdminPassage> {
    return httpClient.post<AdminPassage>('/admin/passages', data);
  }

  async updatePassage(id: string, data: Partial<AdminPassage>): Promise<AdminPassage> {
    return httpClient.put<AdminPassage>(`/admin/passages/${id}`, data);
  }

  async deletePassage(id: string): Promise<void> {
    return httpClient.delete(`/admin/passages/${id}`);
  }

  async publishPassage(id: string, publish: boolean): Promise<AdminPassage> {
    return httpClient.patch<AdminPassage>(`/admin/passages/${id}/publish`, { publish });
  }

  async bulkDeletePassages(passageIds: string[]): Promise<BulkOperationResponse> {
    return httpClient.post<BulkOperationResponse>('/admin/passages/bulk-delete', { 
      passage_ids: passageIds 
    });
  }

  async bulkPublishPassages(passageIds: string[], publish: boolean): Promise<BulkOperationResponse> {
    return httpClient.post<BulkOperationResponse>('/admin/passages/bulk-publish', { 
      passage_ids: passageIds,
      publish 
    });
  }

  // ========== WORDS ==========

  async getWords(filters?: WordFilters): Promise<AdminWordsResponse> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.sources && filters.sources.length > 0) {
      params.append('sources', filters.sources.join(','));
    }
    if (filters?.limit && filters.limit > 0) params.append('limit', String(Math.floor(filters.limit)));
    if (filters?.skip && filters.skip >= 0) params.append('skip', String(Math.floor(filters.skip)));

    const url = `/admin/words${params.toString() ? '?' + params.toString() : ''}`;
    return httpClient.get<AdminWordsResponse>(url);
  }

  async getWordById(id: string): Promise<Word> {
    return httpClient.get<Word>(`/admin/words/${id}`);
  }

  async createWord(data: Omit<Word, 'id' | 'createdAt' | 'updatedAt'>): Promise<Word> {
    return httpClient.post<Word>('/admin/words', data);
  }

  async updateWord(id: string, data: Partial<Omit<Word, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Word> {
    return httpClient.put<Word>(`/admin/words/${id}`, data);
  }

  async deleteWord(id: string): Promise<void> {
    return httpClient.delete(`/admin/words/${id}`);
  }

  // ========== DISCUSSIONS ==========
  
  async getAllDiscussions(limit?: number, skip?: number): Promise<AdminDiscussionsResponse> {
    const params = new URLSearchParams();
    
    if (limit) params.append('limit', String(limit));
    if (skip) params.append('skip', String(skip));

    const url = `/admin/discussions${params.toString() ? '?' + params.toString() : ''}`;
    return httpClient.get<AdminDiscussionsResponse>(url);
  }

  async deleteDiscussion(id: string): Promise<void> {
    return httpClient.delete(`/admin/discussions/${id}`);
  }

  // ========== USER ANALYTICS ==========
  
  async getUserActivityLogs(userId: string, filters?: ActivityFilters): Promise<UserActivityLogsResponse> {
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.skip) params.append('skip', String(filters.skip));

    const url = `/admin/users/${userId}/activity${params.toString() ? '?' + params.toString() : ''}`;
    return httpClient.get<UserActivityLogsResponse>(url);
  }

  async getUserStats(userId: string): Promise<UserAggregatedStats> {
    return httpClient.get<UserAggregatedStats>(`/admin/users/${userId}/stats`);
  }

  async getTotalUsers(): Promise<{ total: number }> {
    return httpClient.get<{ total: number }>('/admin/users/total');
  }

  // ========== DASHBOARD STATS ==========
  
  async getAdminStats(): Promise<AdminStatsResponse> {
    return httpClient.get<AdminStatsResponse>('/admin/stats');
  }
}

export const adminService = new AdminService();
