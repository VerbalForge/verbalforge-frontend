'use client';

import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PartialQuestion } from '@/lib/api';
import { Clock } from 'lucide-react';
import { DifficultyBadge } from './DifficultyBadge';
import { QuestionTypeBadge } from './QuestionTypeBadge';

interface QuestionCardProps {
  question: PartialQuestion;
  onClick?: () => void;
}

const isNewQuestion = (createdAt: string) => {
  const questionDate = new Date(createdAt);
  const now = new Date();
  const diffInHours = (now.getTime() - questionDate.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 24;
};

export function QuestionCard({ question, onClick }: QuestionCardProps) {
  const isNew = isNewQuestion(question.created_at);
  
  return (
    <Card 
      className="hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] h-full" 
      onClick={onClick}
    >
      <CardHeader className="space-y-1.5">
        <div className="flex flex-wrap gap-1.5">
          <QuestionTypeBadge type={question.question_type} />
          <DifficultyBadge difficulty={question.difficulty_level} />
          {isNew && (
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">
              <Clock className="w-3 h-3 mr-1" />
              New
            </Badge>
          )}
        </div>
        <p className="text-sm line-clamp-2 leading-relaxed text-foreground">
          {question.question_text}
        </p>
        <CardDescription className="text-xs text-muted-foreground line-clamp-1 !mt-0.5">
          {question.topic}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
