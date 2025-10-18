'use client';

import { useRouter, useParams } from 'next/navigation';
import { usePracticeContent } from '@/hooks/usePracticeContent';
import { PracticeFilters } from '@/components/practice/PracticeFilters';
import { PracticeContent } from '@/components/practice/PracticeContent';
import { buildNavigationItems, saveNavigationToSession } from '@/lib/utils/practiceNavigation';

export default function PracticePage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;

  const {
    questions,
    passages,
    questionProgress,
    passageProgress,
    loading,
    error,
    page,
    totalPages,
    difficultyFilter,
    typeFilter,
    showNew,
    handleDifficultyChange,
    handleTypeChange,
    handleShowNewToggle,
    setPage,
  } = usePracticeContent();

  const handleQuestionClick = (questionId: string) => {
    const navigationItems = buildNavigationItems(passages, questions);
    saveNavigationToSession(navigationItems, questionId, 'question');
    
    sessionStorage.setItem('currentQuestionId', questionId);
    sessionStorage.removeItem('passageId');
    sessionStorage.removeItem('questionIds');
    sessionStorage.setItem('backRoute', `/${username}/practice`);
    
    // Store current filter state
    sessionStorage.setItem('practiceFilters', JSON.stringify({
      difficulty: difficultyFilter,
      type: typeFilter,
      showNew,
      page,
    }));
    
    router.push(`/${username}/practice/${questionId}`);
  };

  const handlePassageClick = (passageId: string, questionIds: string[]) => {
    const navigationItems = buildNavigationItems(passages, questions);
    saveNavigationToSession(navigationItems, passageId, 'passage');
    
    sessionStorage.setItem('currentPassageId', passageId);
    sessionStorage.setItem('currentQuestionId', questionIds[0]);
    sessionStorage.removeItem('passageId');
    sessionStorage.removeItem('questionIds');
    sessionStorage.setItem('backRoute', `/${username}/practice`);
    
    // Store current filter state
    sessionStorage.setItem('practiceFilters', JSON.stringify({
      difficulty: difficultyFilter,
      type: typeFilter,
      showNew,
      page,
    }));
    
    router.push(`/${username}/practice/${questionIds[0]}`);
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
        showNew={showNew}
        onDifficultyChange={handleDifficultyChange}
        onTypeChange={handleTypeChange}
        onShowNewToggle={handleShowNewToggle}
      />

      <PracticeContent
        isLoading={loading}
        error={error}
        questions={questions}
        passages={passages}
        questionProgress={questionProgress}
        passageProgress={passageProgress}
        currentPage={page}
        totalPages={totalPages}
        onQuestionClick={handleQuestionClick}
        onPassageClick={handlePassageClick}
        onPageChange={setPage}
      />
    </div>
  );
}
