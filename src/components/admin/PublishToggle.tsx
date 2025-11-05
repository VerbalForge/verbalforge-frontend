import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PublishToggleProps {
  published: boolean;
  onToggle: () => void;
  loading?: boolean;
  className?: string;
}

export function PublishToggle({
  published,
  onToggle,
  loading = false,
  className,
}: PublishToggleProps) {
  return (
    <Button
      variant={published ? 'default' : 'outline'}
      size="sm"
      onClick={onToggle}
      disabled={loading}
      className={cn('gap-2', className)}
    >
      {published ? (
        <>
          <CheckCircle2 className="h-4 w-4" />
          Published
        </>
      ) : (
        <>
          <Circle className="h-4 w-4" />
          Unpublished
        </>
      )}
    </Button>
  );
}
