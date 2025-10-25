import { httpClient } from '../api/httpClient';

// Types
export interface SupportTicket {
  id: string;
  userId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupportTicketRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface UpdateSupportTicketRequest {
  status?: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

class SupportService {
  // Authenticated: Create support ticket
  async createSupportTicket(data: CreateSupportTicketRequest): Promise<SupportTicket> {
    return httpClient.post<SupportTicket>('/support', data);
  }

  // Authenticated: Get user's support tickets
  async getUserSupportTickets(): Promise<{ tickets: SupportTicket[] }> {
    return httpClient.get<{ tickets: SupportTicket[] }>('/support/my-tickets');
  }

  // Admin: Get all support tickets
  async getAllSupportTickets(status?: string): Promise<{ tickets: SupportTicket[] }> {
    const params = status ? `?status=${status}` : '';
    return httpClient.get<{ tickets: SupportTicket[] }>(`/admin/support${params}`);
  }

  // Admin: Update support ticket
  async updateSupportTicket(id: string, data: UpdateSupportTicketRequest): Promise<{ message: string }> {
    return httpClient.patch<{ message: string }>(`/admin/support/${id}`, data);
  }

  // Admin: Delete support ticket
  async deleteSupportTicket(id: string): Promise<{ message: string }> {
    return httpClient.delete<{ message: string }>(`/admin/support/${id}`);
  }
}

export const supportService = new SupportService();
