'use client';

import { Word } from '@/lib/models/word';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { RecallStatus } from '@/hooks/useWordRecall';
import { cn } from '@/lib/utils';

interface WordDialogProps {
  word: Word | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  getWordRecall: (wordId: string) => RecallStatus;
  setWordRecall: (wordId: string, status: RecallStatus) => Promise<void>;
}

export function WordDialog({ 
  word, 
  isOpen, 
  onClose, 
  onPrevious, 
  onNext, 
  hasPrevious, 
  hasNext,
  getWordRecall,
  setWordRecall
}: WordDialogProps) {
  
  if (!word) return null;

  const recallStatus = getWordRecall(word.id);

  const handleRecallAction = (status: 'recalled' | 'not-recalled' | null) => {
    setWordRecall(word.id, status);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto px-16 sm:px-20">
        {/* Navigation Buttons - Fixed on sides inside dialog */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={!hasNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        <DialogHeader className="space-y-3">
          {/* Word and Pronunciation */}
          <div className="text-center space-y-1 pt-2">
            <DialogTitle className="text-3xl font-bold">
              {word.word}
            </DialogTitle>
            
            {word.pronunciation && (
              <p className="text-sm text-muted-foreground">
                /{word.pronunciation}/
              </p>
            )}

            {/* Source badges - minimal */}
            {word.sources && word.sources.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center pt-2">
                {word.sources.map((source) => (
                  <Badge key={source} variant="outline" className="text-xs">
                    {source}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Quick Recall Actions - Minimal like WordCard */}
          <div className="flex gap-2 justify-center pt-2">
            <Button
              size="sm"
              variant={recallStatus === 'recalled' ? 'default' : 'outline'}
              onClick={() => handleRecallAction('recalled')}
              className={cn(
                "gap-2",
                recallStatus === 'recalled' 
                  ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
                  : "border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
              )}
            >
              <Check className="h-4 w-4" />
              I Know This
            </Button>
            
            <Button
              size="sm"
              variant={recallStatus === 'not-recalled' ? 'default' : 'outline'}
              onClick={() => handleRecallAction('not-recalled')}
              className={cn(
                "gap-2",
                recallStatus === 'not-recalled'
                  ? "bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
                  : "border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/30"
              )}
            >
              <X className="h-4 w-4" />
              Need Practice
            </Button>
          </div>
        </DialogHeader>

        {/* Main Content - Clean and Minimal */}
        <div className="space-y-4 py-4">
          {/* Definitions */}
          <div className="space-y-4">
            {word.meanings && word.meanings.map((meaning, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-3">
                  <span className="text-primary font-semibold shrink-0">
                    {index + 1}.
                  </span>
                  <div className="space-y-2 flex-1">
                    <p className="text-base leading-relaxed">{meaning.definition}</p>
                    
                    {/* Examples - Subtle */}
                    {meaning.examples && Array.isArray(meaning.examples) && meaning.examples.length > 0 && (
                      <div className="space-y-1 pl-4 border-l-2 border-muted">
                        {meaning.examples.map((example, exIndex) => (
                          <p key={exIndex} className="text-sm italic text-muted-foreground leading-relaxed">
                            &ldquo;{example}&rdquo;
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Synonyms & Antonyms - Minimal Footer */}
          {((word.synonyms && word.synonyms.length > 0) || (word.antonyms && word.antonyms.length > 0)) && (
            <div className="pt-4 border-t space-y-3">
              {word.synonyms && word.synonyms.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Similar
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {word.synonyms.filter(s => s && s.trim()).map((synonym) => (
                      <Badge 
                        key={synonym} 
                        variant="secondary" 
                        className="text-xs font-normal bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
                      >
                        {synonym}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {word.antonyms && word.antonyms.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Opposite
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {word.antonyms.filter(a => a && a.trim()).map((antonym) => (
                      <Badge 
                        key={antonym} 
                        variant="secondary"
                        className="text-xs font-normal bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900"
                      >
                        {antonym}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}