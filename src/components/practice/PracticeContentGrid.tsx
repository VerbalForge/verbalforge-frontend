import { QuestionCard } from '@/components/QuestionCard';
import { PassageCard } from '@/components/PassageCard';
import { Pagination } from '@/components/ui/pagination';
import { PracticeItem, isQuestionItem, isPassageItem } from '@/lib/models/practice';
import { PartialQuestion } from '@/lib/models/question';
import { PartialPassage } from '@/lib/models/passage';

interface PracticeContentGridProps {
  items: PracticeItem[];
  currentPage: number;
  totalPages: number;
  onItemClick: (item: PracticeItem) => void;
  onPageChange: (page: number) => void;
}

export function PracticeContentGrid({
  items,
  currentPage,
  totalPages,
  onItemClick,
  onPageChange,
}: PracticeContentGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No content found matching your filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => {
          if (isPassageItem(item)) {
            // Convert PracticeItem to PartialPassage for PassageCard
            const passage: PartialPassage = {
              id: item.id,
              title: item.title,
              difficulty: item.difficulty,
              created_at: item.created_at,
              passage: item.passage_preview || '',
              question_ids: item.question_ids || [],
            };
            
            return (
              <PassageCard
                key={item.id}
                passage={passage}
                progress={undefined}
                onClick={() => onItemClick(item)}
              />
            );
          } else if (isQuestionItem(item)) {
            // Convert PracticeItem to PartialQuestion for QuestionCard
            const question: PartialQuestion = {
              id: item.id,
              question_text: item.question_text || '',
              question_type: item.question_type || '',
              difficulty_level: item.difficulty,
              topic: item.topic || '',
              created_at: item.created_at,
            };
            
            return (
              <QuestionCard
                key={item.id}
                question={question}
                progress={undefined}
                onClick={() => onItemClick(item)}
              />
            );
          }
          return null;
        })}
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
