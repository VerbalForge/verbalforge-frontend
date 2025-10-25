import { httpClient } from '../api/httpClient';

// Types
export interface Feedback {
  id: string;
  email?: string;
  type: 'suggestion' | 'bug' | 'general' | 'praise';
  message: string;
  status: 'new' | 'reviewed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackRequest {
  email?: string;
  type: 'suggestion' | 'bug' | 'general' | 'praise';
  message: string;
}

export interface UpdateFeedbackStatusRequest {
  status: 'new' | 'reviewed' | 'archived';
}

class FeedbackService {
  // Public: Create feedback
  async createFeedback(data: CreateFeedbackRequest): Promise<Feedback> {
    return httpClient.post<Feedback>('/feedback', data);
  }

  // Admin: Get all feedback
  async getAllFeedback(type?: string, status?: string): Promise<{ feedback: Feedback[] }> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return httpClient.get<{ feedback: Feedback[] }>(`/admin/feedback${queryString}`);
  }

  // Admin: Update feedback status
  async updateFeedbackStatus(id: string, data: UpdateFeedbackStatusRequest): Promise<{ message: string }> {
    return httpClient.patch<{ message: string }>(`/admin/feedback/${id}/status`, data);
  }

  // Admin: Delete feedback
  async deleteFeedback(id: string): Promise<{ message: string }> {
    return httpClient.delete<{ message: string }>(`/admin/feedback/${id}`);
  }
}

export const feedbackService = new FeedbackService();
