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
  id: string;
  question_type: string;
  difficulty_level: string;
  topic: string;
  question_text: string; // Truncated to 150 chars + "..."
  created_at: string;
}

export interface PartialPassage {
  id: string;
  passage: string;
  title: string;
  difficulty: string;
  question_ids: string[];
  created_at: string;
}

export interface Passage {
  id: string;
  passage: string;
  source: string;
  title: string;
  difficulty: string;
  type: string;
  question_ids: string[];
  metadata: PassageMetadata;
}

export interface QuestionsResponse {
  questions: PartialQuestion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  nextCursor?: string;         // Continuation token for next page
  previousCursor?: string;     // Continuation token for previous page
  hasMore: boolean;            // Indicates if more results exist
}

export interface PassagesResponse {
  passages: PartialPassage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  nextCursor?: string;         // Continuation token for next page
  previousCursor?: string;     // Continuation token for previous page
  hasMore: boolean;            // Indicates if more results exist
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Discussion {
  id: string;
  title: string;
  description: string;
  questionIds: string[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  views: number;
  viewedBy: string[];
  likes: number;
  likedBy: string[];
  tags: string[];
  isPinned: boolean;
  isLocked: boolean;
  commentCount: number;
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
  totalXP: number;
  rank: number;
  currentStreak: number;
  longestStreak: number;
  lastLogin: string;
  totalAttempts: number;
  profileViews: number;
  createdAt: string;
}

export interface UserQuestionProgress {
  userId: string;
  questionId: string;
  solved: boolean;
  attempted: boolean;
  lastAttemptAt: string;
  lastSolvedAt?: string;
  timeTaken: number; // in seconds
  difficulty: string;
  questionType: string;
  xpGained: number;
}

export interface UserPassageProgress {
  passageId: string;
  solvedQuestionIds: string[];
  totalQuestions: number;
  solved: boolean;
  attempted: boolean;
}

export interface UserStats {
  userId: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  tcSolved: number;
  seSolved: number;
  rcSolved: number;
  totalXp: number;
  rank: number;
  currentStreak: number;
  longestStreak: number;
  lastLogin: string;
  totalAttempts: number;
  profileViews: number;
}

// Activity calendar response (for GitHub-style visualization)
export interface ActivityCalendarResponse {
  date: string;
  count: number;
  level: number; // 0-4 for GitHub-style activity visualization
}

export interface UserActivityLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  questionsSolved: number;
  questionIds: string[];
  totalXP: number;
  activities: number;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'Text Completion' | 'Sentence Equivalence' | 'Reading Comprehension';
  solvedAt: string;
  xpGained: number;
  passageId?: string;
}

export interface UserProfile {
  user: User;
  stats: UserStats;
  recent_activity: RecentActivityItem[];
}

export interface LeaderboardEntry {
  userId: string;
  rank: number;
  username: string;
  name: string;
  totalXP: number;
  totalSolved: number;
  currentStreak: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  total: number;
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

      const data = await response.json();
      
      // Backend wraps responses in {success: true, data: {...}}
      // Unwrap the data if it's wrapped
      if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
        return data.data as T;
      }
      
      return data as T;
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

  // Question methods
  async getQuestions(params?: {
    page?: number;
    limit?: number;
    difficulty?: string;
    type?: string;
    topic?: string;
    new?: boolean;
    cursor?: string;
  }): Promise<QuestionsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.topic) queryParams.append('topic', params.topic);
    if (params?.new) queryParams.append('new', 'true');
    if (params?.cursor) queryParams.append('cursor', params.cursor);

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
    difficulty?: string;
    new?: boolean;
    cursor?: string;
  }): Promise<PassagesResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params?.new) queryParams.append('new', 'true');
    if (params?.cursor) queryParams.append('cursor', params.cursor);

    const url = `/passages${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.makeRequest<PassagesResponse>(url);
  }

  async getPassageById(id: string): Promise<Passage> {
    return this.makeRequest<Passage>(`/passages/${id}`);
  }

  // Smart mixed content aggregation - fills gaps when one type has fewer items
  async getMixedPracticeContent(params?: {
    page?: number;
    limit?: number;
    difficulty?: string;
    new?: boolean;
  }): Promise<{
    passages: PartialPassage[];
    questions: PartialQuestion[];
    totalPages: number;
  }> {
    const limit = params?.limit || 20;
    const page = params?.page || 1;
    
    // Start by trying to get ~1/3 from each type, but fetch more to handle gaps
    const initialLimit = Math.ceil(limit / 3);
    
    const baseParams = {
      page,
      limit: initialLimit,
      ...(params?.difficulty && { difficulty: params.difficulty }),
      ...(params?.new && { new: params.new }),
    };
    
    // Fetch all types in parallel
    const [tcResponse, seResponse, passagesResponse] = await Promise.all([
      this.getQuestions({ ...baseParams, type: 'text_completion' }),
      this.getQuestions({ ...baseParams, type: 'sentence_equivalence' }),
      this.getPassages(baseParams),
    ]);
    
    // Collect initial items
    let tcQuestions = tcResponse?.questions || [];
    let seQuestions = seResponse?.questions || [];
    let passages = passagesResponse?.passages || [];
    
    let totalItems = tcQuestions.length + seQuestions.length + passages.length;
    
    // If we don't have enough items, fetch more from types that have them
    if (totalItems < limit) {
      const deficit = limit - totalItems;
      
      // Try to fill from types that might have more (those that returned full initial limit)
      const additionalFetches = [];
      
      if (tcQuestions.length === initialLimit) {
        additionalFetches.push(
          this.getQuestions({ 
            ...baseParams, 
            type: 'text_completion', 
            limit: deficit 
          }).then(res => ({ type: 'tc', data: res?.questions || [] }))
        );
      }
      
      if (seQuestions.length === initialLimit) {
        additionalFetches.push(
          this.getQuestions({ 
            ...baseParams, 
            type: 'sentence_equivalence', 
            limit: deficit 
          }).then(res => ({ type: 'se', data: res?.questions || [] }))
        );
      }
      
      if (passages.length === initialLimit) {
        additionalFetches.push(
          this.getPassages({ 
            ...baseParams, 
            limit: deficit 
          }).then(res => ({ type: 'passages', data: res?.passages || [] }))
        );
      }
      
      // Fetch additional items
      if (additionalFetches.length > 0) {
        const additionalResults = await Promise.all(additionalFetches);
        
        // Add additional items until we reach the limit
        for (const result of additionalResults) {
          const remaining = limit - totalItems;
          if (remaining <= 0) break;
          
          if (result.type === 'tc') {
            const toAdd = (result.data as PartialQuestion[]).slice(0, remaining);
            tcQuestions = [...tcQuestions, ...toAdd];
            totalItems += toAdd.length;
          } else if (result.type === 'se') {
            const toAdd = (result.data as PartialQuestion[]).slice(0, remaining);
            seQuestions = [...seQuestions, ...toAdd];
            totalItems += toAdd.length;
          } else if (result.type === 'passages') {
            const toAdd = (result.data as PartialPassage[]).slice(0, remaining);
            passages = [...passages, ...toAdd];
            totalItems += toAdd.length;
          }
        }
      }
    }
    
    // Combine all items with timestamps for sorting
    type ItemWithTimestamp = (PartialQuestion | PartialPassage) & { created_at: string };
    const allItems: ItemWithTimestamp[] = [
      ...tcQuestions,
      ...seQuestions,
      ...passages
    ];
    
    // Sort by created_at (newest first)
    allItems.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
    
    // Limit to exactly the requested number of items
    const limitedItems = allItems.slice(0, limit);
    
    // Separate back into passages and questions while maintaining sorted order
    const sortedPassages: PartialPassage[] = [];
    const sortedQuestions: PartialQuestion[] = [];
    
    limitedItems.forEach(item => {
      if ('question_ids' in item) {
        sortedPassages.push(item as PartialPassage);
      } else {
        sortedQuestions.push(item as PartialQuestion);
      }
    });
    
    // Calculate total pages based on maximum from all responses
    const maxPages = Math.max(
      tcResponse?.totalPages || 1,
      seResponse?.totalPages || 1,
      passagesResponse?.totalPages || 1
    );
    
    return {
      passages: sortedPassages,
      questions: sortedQuestions,
      totalPages: maxPages,
    };
  }

  // User question progress methods
  async submitQuestionAttempt(
    questionId: string, 
    solved: boolean, 
    timeTaken: number
  ): Promise<UserQuestionProgress> {
    return this.makeRequest<UserQuestionProgress>(`/user/questions/${questionId}/attempt`, {
      method: 'POST',
      body: JSON.stringify({ solved, timeTaken }),
    });
  }

  async submitPassageAttempt(
    passageId: string,
    questionId: string,
    solved: boolean,
    timeTaken: number
  ): Promise<{ question: UserQuestionProgress; passage: UserPassageProgress }> {
    return this.makeRequest<{ question: UserQuestionProgress; passage: UserPassageProgress }>(
      `/user/passages/${passageId}/attempt`,
      {
        method: 'POST',
        body: JSON.stringify({ 
          questionAttempts: [{
            questionId,
            solved,
            timeTaken
          }]
        }),
      }
    );
  }

  async getQuestionProgress(questionId: string): Promise<UserQuestionProgress | null> {
    try {
      return await this.makeRequest<UserQuestionProgress>(`/user/questions/${questionId}/progress`);
    } catch {
      // Return null if progress not found
      return null;
    }
  }

  async getPassageProgress(passageId: string): Promise<UserPassageProgress | null> {
    try {
      return await this.makeRequest<UserPassageProgress>(`/user/passages/${passageId}/progress`);
    } catch {
      // Return null if progress not found
      return null;
    }
  }

  async getBulkQuestionProgress(questionIds: string[]): Promise<Record<string, UserQuestionProgress>> {
    return this.makeRequest<Record<string, UserQuestionProgress>>('/user/questions/progress/bulk', {
      method: 'POST',
      body: JSON.stringify({ ids: questionIds }),
    });
  }

  async getBulkPassageProgress(passageIds: string[]): Promise<Record<string, UserPassageProgress>> {
    return this.makeRequest<Record<string, UserPassageProgress>>('/user/passages/progress/bulk', {
      method: 'POST',
      body: JSON.stringify({ ids: passageIds }),
    });
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

  // Profile and Stats methods
  async getUserProfile(username: string): Promise<UserProfile> {
    return this.makeRequest<UserProfile>(`/profile/${username}`);
  }

  async getUserStatsByUsername(username: string): Promise<UserStats> {
    return this.makeRequest<UserStats>(`/profile/${username}/stats`);
  }

  async getActivityCalendar(username: string, days: number = 365): Promise<ActivityCalendarResponse[]> {
    // Get the client's timezone offset in minutes and convert to IANA timezone name
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return this.makeRequest<ActivityCalendarResponse[]>(
      `/profile/${username}/activity/summary?days=${days}&timezone=${encodeURIComponent(timezone)}`
    );
  }

  async incrementProfileView(username: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/profile/${username}/view`, {
      method: 'POST',
    });
  }

  // Leaderboard methods
  async getLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    return this.makeRequest<LeaderboardEntry[]>(`/leaderboard?limit=${limit}`);
  }

  async updateRanks(): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('/leaderboard/ranks/update', {
      method: 'POST',
    });
  }

  // Preferences methods
  async getPreferences(): Promise<User['preferences']> {
    return this.makeRequest<User['preferences']>('/user/preferences');
  }

  async updatePreference(field: string, value: boolean): Promise<{ message: string; preferences: User['preferences'] }> {
    return this.makeRequest<{ message: string; preferences: User['preferences'] }>('/user/preferences', {
      method: 'PATCH',
      body: JSON.stringify({ field, value }),
    });
  }

  async updateTheme(theme: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('/user/theme', {
      method: 'PATCH',
      body: JSON.stringify({ theme }),
    });
  }

  // Discussion APIs
  async getDiscussions(params?: {
    page?: number;
    limit?: number;
    sortBy?: 'newest' | 'oldest' | 'popular' | 'views' | 'updated';
    tags?: string[];
  }): Promise<{
    discussions: Discussion[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.tags) {
      params.tags.forEach(tag => queryParams.append('tags', tag));
    }
    
    return this.makeRequest(`/discussions?${queryParams.toString()}`);
  }

  async getDiscussionById(id: string): Promise<Discussion> {
    return this.makeRequest(`/discussions/${id}`);
  }

  async createDiscussion(data: {
    title: string;
    description: string;
    questionIds?: string[];
    tags?: string[];
  }): Promise<Discussion> {
    return this.makeRequest('/discussions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDiscussion(id: string, data: {
    title?: string;
    description?: string;
    questionIds?: string[];
    tags?: string[];
  }): Promise<Discussion> {
    return this.makeRequest(`/discussions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDiscussion(id: string): Promise<{ message: string }> {
    return this.makeRequest(`/discussions/${id}`, {
      method: 'DELETE',
    });
  }

  async incrementDiscussionView(id: string): Promise<{ message: string }> {
    return this.makeRequest(`/discussions/${id}/view`, {
      method: 'POST',
    });
  }

  async toggleDiscussionLike(id: string): Promise<{ liked: boolean }> {
    return this.makeRequest(`/discussions/${id}/like`, {
      method: 'POST',
    });
  }

  async addComment(discussionId: string, text: string): Promise<Comment> {
    return this.makeRequest(`/discussions/${discussionId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async updateComment(discussionId: string, commentId: string, text: string): Promise<{ message: string }> {
    return this.makeRequest(`/discussions/${discussionId}/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ text }),
    });
  }

  async deleteComment(discussionId: string, commentId: string): Promise<{ message: string }> {
    return this.makeRequest(`/discussions/${discussionId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  async toggleCommentLike(discussionId: string, commentId: string): Promise<{ liked: boolean }> {
    return this.makeRequest(`/discussions/${discussionId}/comments/${commentId}/like`, {
      method: 'POST',
    });
  }

  async getUserDiscussions(username: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    discussions: Discussion[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return this.makeRequest(`/profile/${username}/discussions?${queryParams.toString()}`);
  }

  async searchDiscussions(query: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    discussions: Discussion[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams({ q: query });
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return this.makeRequest(`/discussions/search?${queryParams.toString()}`);
  }
}

export const apiService = new ApiService();