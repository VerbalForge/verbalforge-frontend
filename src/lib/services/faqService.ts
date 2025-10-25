import { httpClient } from '../api/httpClient';

// Types
export interface FAQ {
  id: string;
  email: string;
  question: string;
  status: 'pending' | 'answered' | 'archived';
  answer?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFAQRequest {
  email: string;
  question: string;
}

export interface UpdateFAQStatusRequest {
  status: 'pending' | 'answered' | 'archived';
  answer?: string;
}

class FAQService {
  // Public: Create FAQ submission
  async createFAQ(data: CreateFAQRequest): Promise<FAQ> {
    return httpClient.post<FAQ>('/faq', data);
  }

  // Admin: Get all FAQs
  async getAllFAQs(status?: string): Promise<{ faqs: FAQ[] }> {
    const params = status ? `?status=${status}` : '';
    return httpClient.get<{ faqs: FAQ[] }>(`/admin/faq${params}`);
  }

  // Admin: Update FAQ status
  async updateFAQStatus(id: string, data: UpdateFAQStatusRequest): Promise<{ message: string }> {
    return httpClient.patch<{ message: string }>(`/admin/faq/${id}/status`, data);
  }

  // Admin: Delete FAQ
  async deleteFAQ(id: string): Promise<{ message: string }> {
    return httpClient.delete<{ message: string }>(`/admin/faq/${id}`);
  }
}

export const faqService = new FAQService();
