import { PracticeContentGrid } from './PracticeContentGrid';
import { PracticeSkeleton } from './PracticeSkeleton';
import { PracticeItem } from '@/lib/models/practice';

interface PracticeContentProps {
  isLoading: boolean;
  error: string | null;
  items: PracticeItem[];
  currentPage: number;
  totalPages: number;
  onItemClick: (item: PracticeItem) => void;
  onPageChange: (page: number) => void;
}

export function PracticeContent({
  isLoading,
  error,
  items,
  currentPage,
  totalPages,
  onItemClick,
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
      items={items}
      currentPage={currentPage}
      totalPages={totalPages}
      onItemClick={onItemClick}
      onPageChange={onPageChange}
    />
  );
}
