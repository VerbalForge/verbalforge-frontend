import { PracticeContentGrid } from './PracticeContentGrid';
import { PracticeSkeleton } from './PracticeSkeleton';
import { 
  PartialQuestion, 
  UserQuestionProgress
} from '@/lib/models/question';
import { 
  PartialPassage, 
  UserPassageProgress 
} from '@/lib/models/passage';

interface PracticeContentProps {
  isLoading: boolean;
  error: string | null;
  questions: PartialQuestion[];
  passages: PartialPassage[];
  questionProgress: Record<string, UserQuestionProgress>;
  passageProgress: Record<string, UserPassageProgress>;
  currentPage: number;
  totalPages: number;
  onQuestionClick: (questionId: string) => void;
  onPassageClick: (passageId: string, questionIds: string[]) => void;
  onPageChange: (page: number) => void;
}

export function PracticeContent({
  isLoading,
  error,
  questions,
  passages,
  questionProgress,
  passageProgress,
  currentPage,
  totalPages,
  onQuestionClick,
  onPassageClick,
  onPageChange,
}: PracticeContentProps) {
  if (isLoading) {
    return <PracticeSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <PracticeContentGrid
      questions={questions}
      passages={passages}
      questionProgress={questionProgress}
      passageProgress={passageProgress}
      currentPage={currentPage}
      totalPages={totalPages}
      onQuestionClick={onQuestionClick}
      onPassageClick={onPassageClick}
      onPageChange={onPageChange}
    />
  );
}
