'use client';

import { LinkedQuestion } from '@/lib/models/discussion';
import { Card, CardContent } from '@/components/ui/card';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { QuestionTypeBadge } from '@/components/QuestionTypeBadge';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

interface QuestionPreviewProps {
  linkedQuestion: LinkedQuestion;
  username?: string;
  showLink?: boolean;
}

export function QuestionPreview({ linkedQuestion, username, showLink = false }: QuestionPreviewProps) {
  const handleQuestionClick = () => {
    if (linkedQuestion.passageId) {
      sessionStorage.setItem('navigationItems', JSON.stringify([
        {
          type: 'passage',
          id: linkedQuestion.passageId,
          questionIds: [linkedQuestion.questionId]
        }
      ]));
      sessionStorage.setItem('currentPassageId', linkedQuestion.passageId);
      sessionStorage.setItem('currentQuestionId', linkedQuestion.questionId);
    } else {
      sessionStorage.setItem('navigationItems', JSON.stringify([
        {
          type: 'question',
          id: linkedQuestion.questionId
        }
      ]));
      sessionStorage.removeItem('currentPassageId');
      sessionStorage.setItem('currentQuestionId', linkedQuestion.questionId);
    }
    sessionStorage.setItem('currentNavigationIndex', '0');
  };

  const questionContent = (
    <Card className="bg-muted/50 border-muted">
      <CardContent>
        <div className="space-y-3">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <QuestionTypeBadge type={linkedQuestion.questionType} />
            <DifficultyBadge difficulty={linkedQuestion.difficultyLevel} />
            {linkedQuestion.passageTitle && (
              <Badge variant="outline" className="gap-1">
                <BookOpen className="h-3 w-3" />
                {linkedQuestion.passageTitle}
              </Badge>
            )}
          </div>

          {/* Question Text */}
          <div className="text-sm space-y-2">
            <div
              className="prose prose-sm dark:prose-invert max-w-none line-clamp-3"
              dangerouslySetInnerHTML={{ __html: linkedQuestion.questionText }}
            />
          </div>

          {/* View Question Link */}
          {showLink && username && (
            <div className="pt-2 border-t">
              <Link
                href={`/${username}/practice/${linkedQuestion.questionId}`}
                onClick={handleQuestionClick}
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                View Full Question →
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return questionContent;
}
