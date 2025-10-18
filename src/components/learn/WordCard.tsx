'use client';

import { useState } from 'react';
import { Word } from '@/lib/models/word';
import { Check, X, Loader2 } from 'lucide-react';
import { RecallStatus } from '@/hooks/useWordRecall';
import { cn } from '@/lib/utils';

interface WordCardProps {
  word: Word;
  onClick: () => void;
  getWordRecall: (wordId: string) => RecallStatus;
  setWordRecall: (wordId: string, status: RecallStatus) => Promise<void>;
}

export function WordCard({ word, onClick, getWordRecall, setWordRecall }: WordCardProps) {
  const recallStatus = getWordRecall(word.id);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleTickClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to parent elements
    setIsUpdating(true);
    try {
      await setWordRecall(word.id, 'recalled');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCrossClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to parent elements
    setIsUpdating(true);
    try {
      await setWordRecall(word.id, 'not-recalled');
    } finally {
      setIsUpdating(false);
    }
  };

  const getCardStatusClass = () => {
    switch (recallStatus) {
      case 'recalled':
        return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 hover:border-emerald-300 dark:hover:border-emerald-700';
      case 'not-recalled':
        return 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100 hover:border-rose-300 dark:hover:border-rose-700';
      default:
        return 'bg-card border-border hover:border-border/80 hover:bg-muted/20';
    }
  };

  const handleCardClick = () => {
    onClick();
  };

  return (
    <div
      className={cn(
        "relative p-3 rounded-lg border transition-all duration-200 hover:shadow-sm group",
        getCardStatusClass()
      )}
    >
      {/* Status indicator - visible when status exists */}
      {recallStatus && (
        <div className="absolute top-2 right-2 group-hover:opacity-0 transition-opacity duration-200">
          {recallStatus === 'recalled' ? (
            <Check className="h-3 w-3 text-emerald-600" />
          ) : (
            <X className="h-3 w-3 text-rose-600" />
          )}
        </div>
      )}

      {/* Interactive buttons - visible only on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 z-10">
        <button
          onClick={handleTickClick}
          disabled={isUpdating}
          className={cn(
            "p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 transition-colors duration-150",
            isUpdating && "opacity-50 cursor-not-allowed"
          )}
          title="Mark as recalled"
        >
          {isUpdating ? (
            <Loader2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400 animate-spin" />
          ) : (
            <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          )}
        </button>
        <button
          onClick={handleCrossClick}
          disabled={isUpdating}
          className={cn(
            "p-1 rounded-full bg-rose-100 dark:bg-rose-900/50 hover:bg-rose-200 dark:hover:bg-rose-900/70 transition-colors duration-150",
            isUpdating && "opacity-50 cursor-not-allowed"
          )}
          title="Mark as not recalled"
        >
          {isUpdating ? (
            <Loader2 className="h-3 w-3 text-rose-600 dark:text-rose-400 animate-spin" />
          ) : (
            <X className="h-3 w-3 text-rose-600 dark:text-rose-400" />
          )}
        </button>
      </div>
      
      {/* Word content - clickable area (stops before buttons) */}
      <div className="pr-14 cursor-pointer" onClick={handleCardClick}>
        <h3 className="font-semibold text-sm leading-tight mb-1 truncate">
          {word.word}
        </h3>
        {word.pronunciation && (
          <p className="text-xs text-muted-foreground truncate">
            /{word.pronunciation}/
          </p>
        )}
      </div>
    </div>
  );
}