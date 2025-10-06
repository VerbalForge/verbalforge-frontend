'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Circle } from 'lucide-react';
import { DifficultyBadge } from './DifficultyBadge';
import { QuestionTypeBadge } from './QuestionTypeBadge';

interface PracticeCardProps {
  onClick?: () => void;
  type: string;
  difficulty: string;
  title: string;
  preview: string;
  subtitle?: string;
  isNew?: boolean;
  isSolved?: boolean;
  isAttempted?: boolean;
  metadata?: React.ReactNode; // For additional info like question count
}

export function PracticeCard({ 
  onClick, 
  type, 
  difficulty, 
  title, 
  preview, 
  subtitle,
  isNew = false,
  isSolved = false,
  isAttempted = false,
  metadata
}: PracticeCardProps) {
  return (
    <Card 
      className="hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] h-full" 
      onClick={onClick}
    >
      <CardHeader className="space-y-1">
        <div className="flex flex-wrap gap-1.5">
          <QuestionTypeBadge type={type} />
          <DifficultyBadge difficulty={difficulty} />
          {isNew && (
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">
              <Clock className="w-3 h-3 mr-1" />
              New
            </Badge>
          )}
          {isSolved && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Solved
            </Badge>
          )}
          {isAttempted && !isSolved && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
              <Circle className="w-3 h-3 mr-1" />
              Attempted
            </Badge>
          )}
        </div>
        
        {title && (
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">
            {title}
          </h3>
        )}
        
        {preview && (
          <p className="text-sm line-clamp-2 leading-relaxed text-foreground !mt-1">
            {preview}
          </p>
        )}
        
        {subtitle && (
          <p className="text-xs text-muted-foreground line-clamp-1 !mt-1">
            {subtitle}
          </p>
        )}
        
        {metadata && (
          <p className="text-xs text-muted-foreground line-clamp-1 !mt-1">
            {metadata}
          </p>
        )}
      </CardHeader>
    </Card>
  );
}
