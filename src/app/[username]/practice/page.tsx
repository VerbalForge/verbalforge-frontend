'use client';

import { useRouter, useParams } from 'next/navigation';
import { usePracticeContent } from '@/hooks/usePracticeContent';
import { PracticeFilters } from '@/components/practice/PracticeFilters';
import { PracticeContent } from '@/components/practice/PracticeContent';
import { buildNavigationItems, saveNavigationToSession } from '@/lib/utils/practiceNavigation';
import { isPassageItem, PracticeItem } from '@/lib/models';

export default function PracticePage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;

  const {
    items,
    loading,
    error,
    page,
    totalPages,
    difficultyFilter,
    typeFilter,
    handleDifficultyChange,
    handleTypeChange,
    setPage,
  } = usePracticeContent();

  const handleItemClick = (item: PracticeItem) => {
    const navigationItems = buildNavigationItems(items);
    saveNavigationToSession(navigationItems, item.id, item.type);
    
    sessionStorage.setItem('backRoute', `/${username}/practice`);
    
    // Store current filter state
    sessionStorage.setItem('practiceFilters', JSON.stringify({
      difficulty: difficultyFilter,
      type: typeFilter,
      page,
    }));
    
    // Navigate to first question of passage or directly to question
    if (isPassageItem(item)) {
      if (item.question_ids && item.question_ids.length > 0) {
        sessionStorage.setItem('currentPassageId', item.id);
        sessionStorage.setItem('currentQuestionId', item.question_ids[0]);
        router.push(`/${username}/practice/${item.question_ids[0]}`);
      }
    } else {
      sessionStorage.setItem('currentQuestionId', item.id);
      sessionStorage.removeItem('currentPassageId');
      router.push(`/${username}/practice/${item.id}`);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-muted-foreground text-lg">
          Click on a question to start practicing!
        </p>
      </div>

      <PracticeFilters
        difficultyFilter={difficultyFilter}
        typeFilter={typeFilter}
        onDifficultyChange={handleDifficultyChange}
        onTypeChange={handleTypeChange}
      />

      <PracticeContent
        isLoading={loading}
        error={error}
        items={items}
        currentPage={page}
        totalPages={totalPages}
        onItemClick={handleItemClick}
        onPageChange={setPage}
      />
    </div>
  );
}
