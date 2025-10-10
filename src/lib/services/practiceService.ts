import { httpClient } from '../api/httpClient';
import { PartialQuestion, PartialPassage, QuestionsResponse, PassagesResponse } from '../models';

/**
 * Lazy iterator for a single feed (passages or questions)
 * Fetches data on-demand and maintains its own cursor state
 */
class FeedIterator<T extends { id: string; created_at: string }> {
  private buffer: T[] = [];
  private cursor?: string;
  private exhausted = false;
  private fetchFn: (cursor?: string) => Promise<{ items: T[]; nextCursor?: string }>;
  private lastConsumedItem?: T;

  constructor(
    fetchFn: (cursor?: string) => Promise<{ items: T[]; nextCursor?: string }>,
    initialCursor?: string
  ) {
    this.fetchFn = fetchFn;
    this.cursor = initialCursor;
  }

  /**
   * Peek at the next item without consuming it
   */
  peek(): T | undefined {
    return this.buffer[0];
  }

  /**
   * Get the next item, fetching if needed
   */
  async next(): Promise<T | undefined> {
    // Refill buffer if empty and not exhausted
    if (this.buffer.length === 0 && !this.exhausted) {
      const result = await this.fetchFn(this.cursor);
      this.buffer.push(...result.items);
      this.cursor = result.nextCursor;
      this.exhausted = !result.nextCursor;
    }
    const item = this.buffer.shift();
    if (item) {
      this.lastConsumedItem = item;
    }
    return item;
  }

  /**
   * Check if this iterator is exhausted
   */
  isExhausted(): boolean {
    return this.exhausted && this.buffer.length === 0;
  }

  /**
   * Get the cursor for the next page based on last consumed item
   */
  getCursor(): string | undefined {
    // If we have consumed items, create cursor from last consumed item
    if (this.lastConsumedItem) {
      // Encode the last consumed item's ID and timestamp as cursor
      // Use snake_case to match backend expectations
      return btoa(JSON.stringify({
        last_id: this.lastConsumedItem.id,
        last_created_at: this.lastConsumedItem.created_at
      }));
    }
    return undefined;
  }
}

export class PracticeService {
  private readonly CACHE_PREFIX = 'practice_service_';
  private readonly MAX_HISTORY = 10; // Keep last 10 pages in history
  
  /**
   * Lazy k-way merge with incremental cursor-based pagination
   * Uses iterator pattern to dynamically merge by timestamp
   */
  async getMixedPracticeContent(params?: {
    passageCursor?: string;
    questionCursor?: string;
    limit?: number;
    difficulty_level?: string;
    new?: boolean;
  }): Promise<{
    passages: PartialPassage[];
    questions: PartialQuestion[];
    passageCursor?: string;
    questionCursor?: string;
    passageTotal?: number;
    questionTotal?: number;
    hasMore: boolean;
  }> {
    const limit = params?.limit || 20;
    
    // Track totals from API responses
    let passageTotal = 0;
    let questionTotal = 0;
    
    // Create lazy iterators for passages and questions
    // Pass initial cursors from params to start from correct position
    const passageIterator = new FeedIterator<PartialPassage>(async (cursor) => {
      const passageParams = new URLSearchParams();
      passageParams.append('limit', '30'); // Fetch extra to ensure we have enough
      
      // Use the cursor passed from the iterator
      if (cursor) {
        passageParams.append('cursor', cursor);
      }
      if (params?.difficulty_level) {
        passageParams.append('difficulty', params.difficulty_level);
      }
      if (params?.new) {
        passageParams.append('new', 'true');
      }
      
      const response = await httpClient.get<PassagesResponse>(`/passages?${passageParams.toString()}`);
      
      // Capture total from response
      if (response?.total) {
        passageTotal = response.total;
      }
      
      return {
        items: response?.passages || [],
        nextCursor: response?.nextCursor,
      };
    }, params?.passageCursor); // Pass initial cursor here!
    
    const questionIterator = new FeedIterator<PartialQuestion>(async (cursor) => {
      const questionParams = new URLSearchParams();
      questionParams.append('limit', '70'); // Fetch extra to ensure we have enough
      questionParams.append('type', 'text_completion_single,text_completion_double,text_completion_triple,sentence_equivalence');
      
      // Use the cursor passed from the iterator
      if (cursor) {
        questionParams.append('cursor', cursor);
      }
      if (params?.difficulty_level) {
        questionParams.append('difficulty', params.difficulty_level);
      }
      if (params?.new) {
        questionParams.append('new', 'true');
      }
      
      const response = await httpClient.get<QuestionsResponse>(`/questions?${questionParams.toString()}`);
      
      // Capture total from response
      if (response?.total) {
        questionTotal = response.total;
      }
      
      return {
        items: response?.questions || [],
        nextCursor: response?.nextCursor,
      };
    }, params?.questionCursor); // Pass initial cursor here!
    
    // Merge items incrementally by timestamp (newest first)
    const mergedItems: (PartialPassage | PartialQuestion)[] = [];
    let itemA = await passageIterator.next();
    let itemB = await questionIterator.next();
    
    while (mergedItems.length < limit && (itemA || itemB)) {
      if (!itemB || (itemA && new Date(itemA.created_at).getTime() >= new Date(itemB.created_at).getTime())) {
        // itemA is newer or itemB exhausted
        mergedItems.push(itemA!);
        itemA = await passageIterator.next();
      } else {
        // itemB is newer or itemA exhausted
        mergedItems.push(itemB);
        itemB = await questionIterator.next();
      }
    }
    
    // Separate back into passages and questions
    const passages: PartialPassage[] = [];
    const questions: PartialQuestion[] = [];
    
    mergedItems.forEach(item => {
      if ('question_ids' in item) {
        passages.push(item as PartialPassage);
      } else {
        questions.push(item as PartialQuestion);
      }
    });
    
    // Generate cursors from the LAST MERGED items, not from iterator state
    // This ensures we continue from exactly where we left off
    const lastPassage = passages.length > 0 ? passages[passages.length - 1] : null;
    const lastQuestion = questions.length > 0 ? questions[questions.length - 1] : null;
    
    const passageCursor = lastPassage ? btoa(JSON.stringify({
      last_id: lastPassage.id,
      last_created_at: lastPassage.created_at
    })) : undefined;
    
    const questionCursor = lastQuestion ? btoa(JSON.stringify({
      last_id: lastQuestion.id,
      last_created_at: lastQuestion.created_at
    })) : undefined;
    
    // Determine if there's more data
    const hasMore = !passageIterator.isExhausted() || !questionIterator.isExhausted();
    
    return {
      passages,
      questions,
      passageCursor,
      questionCursor,
      passageTotal,
      questionTotal,
      hasMore,
    };
  }
  
  /**
   * Clear the practice cache (useful for resetting filters)
   */
  clearCache(): void {
    // Clear any cached page history
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith(this.CACHE_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  }
}

export const practiceService = new PracticeService();
