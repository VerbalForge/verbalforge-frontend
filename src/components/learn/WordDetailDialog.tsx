import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, CheckCircle2, Brain, ChevronLeft, ChevronRight } from 'lucide-react';
import { Word } from '@/lib/models/word';
import { useState } from 'react';

interface WordDetailDialogProps {
  word: Word | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalWords?: number;
  status?: 'known' | 'practice' | 'unlearned';
  onUpdateStatus?: (wordId: string, status: 'known' | 'practice' | 'reset') => Promise<void>;
}

export function WordDetailDialog({
  word,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  currentIndex,
  totalWords,
  status = 'unlearned',
  onUpdateStatus,
}: WordDetailDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!word) return null;

  const handleStatusUpdate = async (newStatus: 'known' | 'practice' | 'reset') => {
    if (!onUpdateStatus) return;
    
    setIsUpdating(true);
    try {
      await onUpdateStatus(word.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{word.word}</DialogTitle>
              {word.pronunciation && (
                <DialogDescription className="flex items-center gap-1 mt-1">
                  <Volume2 className="w-4 h-4" />
                  {word.pronunciation}
                </DialogDescription>
              )}
            </div>
            {onUpdateStatus && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={status === 'known' ? 'default' : 'outline'}
                  onClick={() => handleStatusUpdate(status === 'known' ? 'reset' : 'known')}
                  disabled={isUpdating}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Known
                </Button>
                <Button
                  size="sm"
                  variant={status === 'practice' ? 'default' : 'outline'}
                  className={status === 'practice' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}
                  onClick={() => handleStatusUpdate(status === 'practice' ? 'reset' : 'practice')}
                  disabled={isUpdating}
                >
                  <Brain className="w-4 h-4 mr-1" />
                  Practice
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Meanings */}
          <div>
            <h3 className="font-semibold mb-2">Meanings</h3>
            <div className="space-y-3">
              {word.meanings && word.meanings.map((meaning, idx) => (
                <div key={idx} className="border-l-2 border-primary pl-4">
                  <p className="text-sm font-medium">{meaning.definition}</p>
                  {meaning.examples && Array.isArray(meaning.examples) && meaning.examples.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {meaning.examples.map((example, exIdx) => (
                        <p key={exIdx} className="text-sm text-muted-foreground italic">
                          &ldquo;{example}&rdquo;
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

                    {/* Synonyms */}
          {word.synonyms && word.synonyms.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Synonyms</h3>
              <div className="flex flex-wrap gap-2">
                {word.synonyms.filter(s => s && s.trim()).map((synonym) => (
                  <Badge key={synonym} variant="secondary">
                    {synonym}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Antonyms */}
          {word.antonyms && word.antonyms.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Antonyms</h3>
              <div className="flex flex-wrap gap-2">
                {word.antonyms.filter(a => a && a.trim()).map((antonym) => (
                  <Badge key={antonym} variant="outline">
                    {antonym}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {word.sources && word.sources.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Sources</h3>
              <div className="flex flex-wrap gap-2">
                {word.sources.filter(s => s && s.trim()).map((source) => (
                  <Badge key={source} variant="default">
                    {source}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {(onPrevious || onNext) && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!hasPrevious}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            {currentIndex !== undefined && totalWords !== undefined && (
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} of {totalWords}
              </span>
            )}
            <Button
              variant="outline"
              onClick={onNext}
              disabled={!hasNext}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
