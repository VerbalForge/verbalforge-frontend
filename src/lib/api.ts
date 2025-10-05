const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Choice {
  option: string;
  blank: number;
  is_correct: boolean;
  reasoning: string;
}

export interface QuestionMetadata {
  created_at: string;
  updated_at: string;
  published_at: string;
  batch_id: string;
}

export interface PassageMetadata {
  created_at: string;
  updated_at: string;
  published_at: string;
  batch_id: string;
}

// Full question details (used for single question view)
export interface Question {
  id: string;
  question_id: string;
  question_type: string;
  difficulty_level: string;
  topic: string;
  question_text: string;
  passage_id?: string; // Optional, only for reading comprehension questions
  choices: Choice[];
  metadata: QuestionMetadata;
}

// Partial question (used for listing - text truncated to 150 chars)
export interface PartialQuestion {
  question_id: string;
  question_type: string;
  difficulty_level: string;
  topic: string;
  question_text: string; // Truncated to 150 chars + "..."
  created_at: string;
}

export interface Passage {
  id: string;
  passage: string;
  source: string;
  question_ids: string[];
  metadata: PassageMetadata;
}

export interface QuestionsResponse {
  questions: PartialQuestion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PassagesResponse {
  passages: Passage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  bio?: string;
  preferences: {
    profile: {
      visibility: boolean;
      progress: boolean;
      leaderboard: boolean;
    };
    theme: string;
  };
  createdAt: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Backend returns error in 'error' field, fallback to 'message'
        const errorMessage = errorData.error || errorData.message;
        
        // Provide user-friendly messages for common status codes
        if (response.status === 401) {
          throw new Error(errorMessage || 'Invalid email or password');
        } else if (response.status === 403) {
          throw new Error(errorMessage || 'Access denied');
        } else if (response.status === 404) {
          throw new Error(errorMessage || 'Resource not found');
        } else if (response.status === 500) {
          throw new Error(errorMessage || 'Server error. Please try again later');
        }
        
        throw new Error(errorMessage || 'An error occurred');
      }

      return response.json();
    } catch (error) {
      // Re-throw the error for the calling code to handle
      throw error;
    }
  }

    // Auth methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token in localStorage
    localStorage.setItem('token', response.token);
    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store token in localStorage
    localStorage.setItem('token', response.token);
    return response;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    // Optionally call backend logout endpoint
    // await this.makeRequest('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser(): Promise<User> {
    return this.makeRequest<User>('/auth/me');
  }

  async deleteAccount(password: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('/auth/delete-account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  }

  async updateProfile(data: { name?: string; phone?: string; bio?: string }): Promise<{ message: string; user: User }> {
    return this.makeRequest<{ message: string; user: User }>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<User> {
    return this.makeRequest<User>('/user/profile');
  }

  async getUserStats(): Promise<{ totalPractices: number; currentLevel: number; experiencePoints: number; achievements: string[] }> {
    return this.makeRequest('/user/stats');
  }

  async getPreferences(): Promise<{ profile: { visibility: boolean; progress: boolean; leaderboard: boolean } }> {
    return this.makeRequest('/user/preferences');
  }

  async updatePreference(field: 'visibility' | 'progress' | 'leaderboard', value: boolean): Promise<{ message: string; preferences: { profile: { visibility: boolean; progress: boolean; leaderboard: boolean }; theme: string } }> {
    return this.makeRequest('/user/preferences', {
      method: 'PATCH',
      body: JSON.stringify({ field, value }),
    });
  }

  async updateTheme(theme: 'light' | 'dark'): Promise<{ message: string; theme: string }> {
    return this.makeRequest('/user/theme', {
      method: 'PATCH',
      body: JSON.stringify({ theme }),
    });
  }

  // Question methods
  async getQuestions(params?: {
    page?: number;
    limit?: number;
    difficulty?: string;
    type?: string;
    topic?: string;
    new?: boolean;
  }): Promise<QuestionsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.topic) queryParams.append('topic', params.topic);
    if (params?.new) queryParams.append('new', 'true');

    const url = `/questions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.makeRequest<QuestionsResponse>(url);
  }

  async getQuestionById(id: string): Promise<Question> {
    return this.makeRequest<Question>(`/questions/${id}`);
  }

  // Passage methods
  async getPassages(params?: {
    page?: number;
    limit?: number;
  }): Promise<PassagesResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `/passages${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.makeRequest<PassagesResponse>(url);
  }

  async getPassageById(id: string): Promise<Passage> {
    return this.makeRequest<Passage>(`/passages/${id}`);
  }

  // File upload method
  async uploadFile(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return response.json();
  }
}

export const apiService = new ApiService();