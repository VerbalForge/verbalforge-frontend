import { httpClient } from '../api/httpClient';
import {
  Passage,
  PassagesResponse,
  UserPassageProgress,
  SubmitPassageAttemptRequest,
  UserQuestionProgress,
} from '../models';
import { PassageFilters } from '../types/api';

export class PassageService {
  async getPassages(filters?: PassageFilters): Promise<PassagesResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.cursor) queryParams.append('cursor', filters.cursor);
    if (filters?.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters?.new) queryParams.append('new', 'true');

    const url = `/passages${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return httpClient.get<PassagesResponse>(url);
  }

  async getPassageById(id: string): Promise<Passage> {
    return httpClient.get<Passage>(`/passages/${id}`);
  }

  async submitPassageAttempt(
    passageId: string,
    data: SubmitPassageAttemptRequest
  ): Promise<{ question: UserQuestionProgress; passage: UserPassageProgress }> {
    return httpClient.post<{ question: UserQuestionProgress; passage: UserPassageProgress }>(
      `/user/passages/${passageId}/attempt`,
      data
    );
  }

  async getPassageProgress(passageId: string): Promise<UserPassageProgress | null> {
    try {
      return await httpClient.get<UserPassageProgress>(`/user/passages/${passageId}/progress`);
    } catch {
      return null;
    }
  }

  async getBulkPassageProgress(passageIds: string[]): Promise<Record<string, UserPassageProgress>> {
    return httpClient.post<Record<string, UserPassageProgress>>('/user/passages/progress/bulk', {
      ids: passageIds,
    });
  }
}

export const passageService = new PassageService();
