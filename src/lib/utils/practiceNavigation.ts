import { PracticeItem, isPassageItem } from '@/lib/models/practice';

interface NavigationItem {
  id: string;
  type: 'question' | 'passage';
  questionIds?: string[];
}

/**
 * Builds navigation items array for session storage from unified practice items
 */
export function buildNavigationItems(items: PracticeItem[]): NavigationItem[] {
  return items.map(item => {
    if (isPassageItem(item)) {
      return {
        id: item.id,
        type: 'passage' as const,
        questionIds: item.question_ids || []
      };
    } else {
      return {
        id: item.id,
        type: 'question' as const
      };
    }
  });
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
