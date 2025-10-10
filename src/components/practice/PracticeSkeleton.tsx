import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PracticeSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="pb-1 pt-3 px-4 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-14" />
            </div>
            <Skeleton className="h-3 w-20" />
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <div className="pt-1">
              <Skeleton className="h-5 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
