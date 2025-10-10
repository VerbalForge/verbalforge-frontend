import { httpClient } from '../api/httpClient';
import {
  Question,
  QuestionsResponse,
  UserQuestionProgress,
  SubmitQuestionAttemptRequest,
} from '../models';
import { QuestionFilters } from '../types/api';

export class QuestionService {
  async getQuestions(filters?: QuestionFilters): Promise<QuestionsResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.cursor) queryParams.append('cursor', filters.cursor);
    if (filters?.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.topic) queryParams.append('topic', filters.topic);
    if (filters?.new) queryParams.append('new', 'true');

    const url = `/questions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return httpClient.get<QuestionsResponse>(url);
  }

  async getQuestionById(id: string): Promise<Question> {
    return httpClient.get<Question>(`/questions/${id}`);
  }

  async submitQuestionAttempt(
    questionId: string,
    data: SubmitQuestionAttemptRequest
  ): Promise<UserQuestionProgress> {
    return httpClient.post<UserQuestionProgress>(`/user/questions/${questionId}/attempt`, data);
  }

  async getQuestionProgress(questionId: string): Promise<UserQuestionProgress | null> {
    try {
      return await httpClient.get<UserQuestionProgress>(`/user/questions/${questionId}/progress`);
    } catch {
      return null;
    }
  }

  async getBulkQuestionProgress(questionIds: string[]): Promise<Record<string, UserQuestionProgress>> {
    return httpClient.post<Record<string, UserQuestionProgress>>('/user/questions/progress/bulk', {
      ids: questionIds,
    });
  }
}

export const questionService = new QuestionService();
