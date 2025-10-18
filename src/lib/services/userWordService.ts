import { httpClient } from '../api/httpClient';

export interface UserWordProgress {
  id: string;
  user_id: string;
  known: string[];
  practice: string[];
}

export interface WordStatusUpdateRequest {
  status: 'known' | 'practice' | 'reset';
}

class UserWordService {
  private baseUrl = '/words';

  async updateWordStatus(wordId: string, status: 'known' | 'practice' | 'reset'): Promise<void> {
    const request: WordStatusUpdateRequest = { status };
    return httpClient.post(`${this.baseUrl}/${wordId}/status`, request);
  }

  async getUserProgress(): Promise<UserWordProgress | null> {
    try {
      return await httpClient.get<UserWordProgress>(`${this.baseUrl}/progress`);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  }

  async resetProgress(): Promise<void> {
    return httpClient.post(`${this.baseUrl}/progress/reset`, {});
  }
}

export const userWordService = new UserWordService();