import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle2, Brain } from 'lucide-react';
import { Word } from '@/lib/models/word';

interface WordCardViewProps {
  word: Word;
  onClick: () => void;
  status?: 'known' | 'practice' | 'unlearned';
  onUpdateStatus?: (wordId: string, status: 'known' | 'practice' | 'reset') => Promise<void>;
}

export function WordCardView({ word, onClick, status = 'unlearned', onUpdateStatus }: WordCardViewProps) {
  const handleStatusClick = async (e: React.MouseEvent, newStatus: 'known' | 'practice' | 'reset') => {
    e.stopPropagation(); // Prevent card click
    if (onUpdateStatus) {
      await onUpdateStatus(word.id, newStatus);
    }
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{word.word}</CardTitle>
            {word.pronunciation && (
              <CardDescription className="mt-1 flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                {word.pronunciation}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Quick Action Icon Buttons */}
            {onUpdateStatus && (
              <>
                <Button
                  size="icon"
                  variant={status === 'known' ? 'default' : 'ghost'}
                  className="h-8 w-8"
                  onClick={(e) => handleStatusClick(e, status === 'known' ? 'reset' : 'known')}
                  title={status === 'known' ? 'Remove from Known' : 'Mark as Known'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant={status === 'practice' ? 'default' : 'ghost'}
                  className={`h-8 w-8 ${status === 'practice' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}`}
                  onClick={(e) => handleStatusClick(e, status === 'practice' ? 'reset' : 'practice')}
                  title={status === 'practice' ? 'Remove from Practice' : 'Mark for Practice'}
                >
                  <Brain className="w-4 h-4" />
                </Button>
              </>
            )}
            {/* Status Badges (optional - can be removed if you prefer only icons) */}
            {!onUpdateStatus && status === 'known' && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Known
              </Badge>
            )}
            {!onUpdateStatus && status === 'practice' && (
              <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                <Brain className="w-3 h-3 mr-1" />
                Practice
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {word.meanings && word.meanings.slice(0, 2).map((meaning, idx) => (
            <p key={idx} className="text-sm text-muted-foreground line-clamp-2">
              {idx + 1}. {meaning.definition}
            </p>
          ))}
          {word.meanings && word.meanings.length > 2 && (
            <p className="text-xs text-muted-foreground">
              +{word.meanings.length - 2} more meanings
            </p>
          )}
        </div>
        {word.sources && word.sources.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {word.sources.filter(s => s && s.trim()).slice(0, 3).map((source) => (
              <Badge key={source} variant="outline" className="text-xs">
                {source}
              </Badge>
            ))}
            {word.sources.filter(s => s && s.trim()).length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{word.sources.filter(s => s && s.trim()).length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
