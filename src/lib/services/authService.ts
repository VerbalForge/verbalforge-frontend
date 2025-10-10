import { httpClient } from '../api/httpClient';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  ChangePasswordRequest,
  DeleteAccountRequest,
} from '../models';

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
    // Store token in localStorage
    localStorage.setItem('token', response.token);
    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/register', userData);
    // Store token in localStorage
    localStorage.setItem('token', response.token);
    return response;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    // Optionally call backend logout endpoint if implemented
  }

  async getCurrentUser(): Promise<User> {
    return httpClient.get<User>('/auth/me');
  }

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return httpClient.post<{ message: string }>('/auth/change-password', data);
  }

  async deleteAccount(data: DeleteAccountRequest): Promise<{ message: string }> {
    return httpClient.delete<{ message: string }>('/auth/delete-account', data);
  }
}

export const authService = new AuthService();
