'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { Choice } from '@/lib/api';

interface OptionButtonProps {
  option: string;
  isSelected: boolean;
  isSubmitted: boolean;
  isCorrect: boolean;
  choice: Choice | null;
  onClick: () => void;
}

export function OptionButton({
  option,
  isSelected,
  isSubmitted,
  isCorrect,
  choice,
  onClick,
}: OptionButtonProps) {
  return (
    <div
      className={`border rounded-md p-2.5 cursor-pointer transition-all ${
        !isSubmitted
          ? isSelected
            ? 'border-primary bg-primary/5'
            : 'hover:border-primary/50 border-border'
          : isSelected
          ? isCorrect
            ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
            : 'border-red-500 bg-red-50 dark:bg-red-900/10'
          : 'border-border'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
            !isSubmitted
              ? isSelected
                ? 'border-primary bg-primary'
                : 'border-muted-foreground'
              : isSelected
              ? isCorrect
                ? 'border-green-600 bg-green-600'
                : 'border-red-600 bg-red-600'
              : 'border-muted-foreground'
          }`}
        >
          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm">{option}</p>

          {isSubmitted && isSelected && choice && (
            <div
              className={`mt-1.5 p-2 rounded text-xs ${
                isCorrect
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-900 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/20 text-red-900 dark:text-red-300'
              }`}
            >
              <p className="font-medium mb-0.5 flex items-center gap-1">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Correct
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" />
                    Incorrect
                  </>
                )}
              </p>
              <p className="leading-snug">{choice.reasoning}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
