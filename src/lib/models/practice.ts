/**
 * Practice item types and interfaces for unified practice content
 */

export type PracticeItemType = 'question' | 'passage';

export interface PracticeItem {
  id: string;
  type: PracticeItemType;
  title: string;
  difficulty: string;
  created_at: string;

  // Question-specific fields (present only if type is 'question')
  question_text?: string;
  question_type?: string;
  topic?: string;

  // Passage-specific fields (present only if type is 'passage')
  passage_preview?: string;
  question_ids?: string[];
  source?: string;
}

export interface PracticeResponse {
  items: PracticeItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PracticeFilters {
  page?: number;
  limit?: number;
  difficulty?: string;
  type?: string;
}

// Type guards for discriminating practice items
export function isQuestionItem(item: PracticeItem): item is PracticeItem & {
  question_text: string;
  question_type: string;
  topic: string;
} {
  return item.type === 'question';
}

export function isPassageItem(item: PracticeItem): item is PracticeItem & {
  passage_preview: string;
  question_ids: string[];
} {
  return item.type === 'passage';
}
