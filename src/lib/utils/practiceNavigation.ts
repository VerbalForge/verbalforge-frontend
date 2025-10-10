import { PartialQuestion } from '@/lib/models/question';
import { PartialPassage } from '@/lib/models/passage';

interface NavigationItem {
  id: string;
  type: 'question' | 'passage';
  questionIds?: string[];
}

/**
 * Builds navigation items array for session storage
 */
export function buildNavigationItems(
  passages: PartialPassage[],
  questions: PartialQuestion[]
): NavigationItem[] {
  return [
    ...passages.map(p => ({ 
      id: p.id, 
      type: 'passage' as const,
      questionIds: p.question_ids || []
    })),
    ...questions.map(q => ({ 
      id: q.id, 
      type: 'question' as const 
      // No questionIds for standalone questions - the item itself is the question
    }))
  ];
}

/**
 * Saves navigation items and current index to session storage
 */
export function saveNavigationToSession(
  items: NavigationItem[],
  currentId: string,
  currentType: 'question' | 'passage'
) {
  sessionStorage.setItem('navigationItems', JSON.stringify(items));
  const currentIndex = items.findIndex(
    item => item.id === currentId && item.type === currentType
  );
  if (currentIndex !== -1) {
    sessionStorage.setItem('currentNavigationIndex', currentIndex.toString());
  }
}
