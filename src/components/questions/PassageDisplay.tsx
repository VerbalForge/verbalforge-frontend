'use client';

import { Passage } from '@/lib/api';
import { Loader2, AlertCircle } from 'lucide-react';

interface PassageDisplayProps {
  passage: Passage | null;
  loading: boolean;
  error: string | null;
  isHighlight?: boolean;
}

export function PassageDisplay({ passage, loading, error, isHighlight = false }: PassageDisplayProps) {
  if (loading) {
    return (
      <div className="flex-1 border rounded-md p-4 flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading passage...</p>
        </div>
      </div>
    );
  }

  if (error || !passage) {
    return (
      <div className="flex-1 border border-red-200 rounded-md p-4 flex items-center justify-center bg-red-50 dark:bg-red-900/10">
        <div className="flex flex-col items-center gap-2 text-center max-w-md">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <p className="text-sm text-red-900 dark:text-red-300 font-medium">
            {error || 'Failed to load passage'}
          </p>
          {error?.includes('schema') && (
            <p className="text-xs text-red-700 dark:text-red-400 mt-1">
              This question may be from the old database schema. Please ensure the question has been migrated and includes a valid passage_id field.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Split passage into sentences if it's a highlight question
  const renderPassageContent = () => {
    if (isHighlight && passage.passage) {
      // Split by sentence markers [1], [2], etc.
      const parts = passage.passage.split(/(\[\d+\])/);
      const sentences: { number: string; text: string }[] = [];
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim();
        if (part.match(/^\[\d+\]$/)) {
          const number = part;
          const text = parts[i + 1]?.trim() || '';
          if (text) {
            sentences.push({ number, text });
            i++; // Skip the next part as we've already used it
          }
        }
      }

      if (sentences.length > 0) {
        return (
          <div className="space-y-3">
            {sentences.map((sentence, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-xs font-semibold text-primary flex-shrink-0 mt-0.5">
                  {sentence.number}
                </span>
                <p className="text-sm leading-relaxed">{sentence.text}</p>
              </div>
            ))}
          </div>
        );
      }
    }

    // Regular passage display
    return <p className="text-sm leading-relaxed whitespace-pre-wrap">{passage.passage}</p>;
  };

  return (
    <div className="flex-1 border rounded-md overflow-hidden flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {renderPassageContent()}
          
          {passage.source && (
            <div className="pt-3 border-t mt-4">
              <p className="text-xs text-muted-foreground italic">
                Source: {passage.source}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
