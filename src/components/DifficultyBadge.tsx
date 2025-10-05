'use client';

import { Badge } from '@/components/ui/badge';

interface DifficultyBadgeProps {
  difficulty: string;
  className?: string;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
    case 'hard':
      return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
    default:
      return 'bg-muted text-foreground border-border';
  }
};

export function DifficultyBadge({ difficulty, className = '' }: DifficultyBadgeProps) {
  const colorClass = getDifficultyColor(difficulty);
  const displayText = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <Badge variant="outline" className={`${colorClass} ${className}`}>
      {displayText}
    </Badge>
  );
}
