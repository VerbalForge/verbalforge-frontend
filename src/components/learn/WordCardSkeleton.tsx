import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function WordCardSkeleton() {
  return (
    <div
      className={cn(
        "relative p-3 rounded-lg border bg-card transition-all duration-200"
      )}
    >
      {/* Word content skeleton */}
      <div className="pr-6">
        <Skeleton className="h-4 w-3/4 mb-1" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
