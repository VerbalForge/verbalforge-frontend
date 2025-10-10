import { QuestionCard } from '@/components/QuestionCard';
import { PassageCard } from '@/components/PassageCard';
import { Pagination } from '@/components/ui/pagination';
import { 
  PartialQuestion, 
  UserQuestionProgress
} from '@/lib/models/question';
import { 
  PartialPassage, 
  UserPassageProgress 
} from '@/lib/models/passage';

interface PracticeContentGridProps {
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

export function PracticeContentGrid({
  questions,
  passages,
  questionProgress,
  passageProgress,
  currentPage,
  totalPages,
  onQuestionClick,
  onPassageClick,
  onPageChange,
}: PracticeContentGridProps) {
  const hasContent = passages.length > 0 || questions.length > 0;

  if (!hasContent) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No content found matching your filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Render passages */}
        {passages.map((passage) => (
          <PassageCard
            key={passage.id}
            passage={passage}
            progress={passageProgress[passage.id]}
            onClick={() => onPassageClick(passage.id, passage.question_ids)}
          />
        ))}

        {/* Render questions */}
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            progress={questionProgress[question.id]}
            onClick={() => onQuestionClick(question.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mt-8"
      />
    </>
  );
}
