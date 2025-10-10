'use client';

import { ReactNode } from 'react';
import { Question, UserQuestionProgress } from '@/lib/models/question';
import { CheckCircle2, XCircle } from 'lucide-react';
import { QuestionFooter } from './QuestionFooter';
import { DifficultyBadge } from '../DifficultyBadge';
import { QuestionTypeBadge } from '../QuestionTypeBadge';
import { Badge } from '@/components/ui/badge';

interface BaseQuestionProps {
  question: Question;
  progress?: UserQuestionProgress | null;
  result?: { type: 'success' | 'error' | 'partial'; message: string } | null;
  instructions?: string;
  onSubmit: () => void;
  onClear: () => void;
  submitDisabled: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  children: ReactNode;
  additionalContent?: ReactNode;
}

export function BaseQuestion({
  question,
  progress,
  result,
  instructions,
  onSubmit,
  onClear,
  submitDisabled,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
  children,
  additionalContent,
}: BaseQuestionProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-2">
        {/* Question Header */}
        <div className="flex items-center gap-2">
          <QuestionTypeBadge type={question.question_type} />
          <DifficultyBadge difficulty={question.difficulty_level} />
          {progress?.solved && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Solved
            </Badge>
          )}
          {progress?.attempted && !progress?.solved && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
              Attempted
            </Badge>
          )}
        </div>

        {/* Instructions */}
        {instructions && (
          <p className="text-xs text-muted-foreground">{instructions}</p>
        )}

        {/* Additional Content (e.g., passage) */}
        {additionalContent}

        {/* Question Text */}
        <div className="py-1.5">
          <p className="text-sm leading-normal">{question.question_text}</p>
        </div>

        {/* Result Message */}
        {result && (
          <div
            className={`border rounded-md p-2.5 ${
              result.type === 'success'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                : result.type === 'partial'
                ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                : 'border-red-500 bg-red-50 dark:bg-red-900/10'
            }`}
          >
            <div className="flex items-center gap-2">
              {result.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              )}
              <p
                className={`font-medium text-xs ${
                  result.type === 'success'
                    ? 'text-green-900 dark:text-green-300'
                    : result.type === 'partial'
                    ? 'text-yellow-900 dark:text-yellow-300'
                    : 'text-red-900 dark:text-red-300'
                }`}
              >
                {result.message}
              </p>
            </div>
          </div>
        )}

        {/* Answer Choices - passed as children */}
        {children}
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="mt-2.5">
        <QuestionFooter
          onClear={onClear}
          onSubmit={onSubmit}
          clearDisabled={false}
          submitDisabled={submitDisabled}
          onPrev={onPrev}
          onNext={onNext}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      </div>
    </div>
  );
}
