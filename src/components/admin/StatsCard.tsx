import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  loading?: boolean;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = 'text-blue-600 dark:text-blue-400',
  iconBgColor = 'bg-blue-100 dark:bg-blue-950',
  loading = false,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn('hover:shadow-md transition-shadow gap-0 py-4', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className={cn('p-2 rounded-lg', iconBgColor)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {loading ? (
            <div className="h-9 w-16 bg-muted animate-pulse rounded" />
          ) : (
            value
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
