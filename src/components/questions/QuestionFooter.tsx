'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuestionFooterProps {
  // Left side buttons
  onClear?: () => void;
  onSubmit?: () => void;
  clearDisabled?: boolean;
  submitDisabled?: boolean;
  clearLabel?: string;
  submitLabel?: string;
  
  // Right side navigation
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  
  // Styling
  className?: string;
}

export function QuestionFooter({
  onClear,
  onSubmit,
  clearDisabled = false,
  submitDisabled = false,
  clearLabel = 'Clear Selection',
  submitLabel = 'Submit Answer',
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  prevLabel = 'Prev',
  nextLabel = 'Next',
  className = '',
}: QuestionFooterProps) {
  return (
    <div className={`flex justify-between gap-2 pt-2.5 border-t ${className}`}>
      <div className="flex gap-2">
        {onClear && (
          <Button 
            onClick={onClear}
            variant="outline"
            disabled={clearDisabled}
          >
            {clearLabel}
          </Button>
        )}
        {onSubmit && (
          <Button 
            onClick={onSubmit}
            disabled={submitDisabled}
          >
            {submitLabel}
          </Button>
        )}
      </div>
      
      <div className="flex gap-2">
        {onPrev && (
          <Button 
            onClick={onPrev}
            variant="outline"
            disabled={!hasPrev}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {prevLabel}
          </Button>
        )}
        {onNext && (
          <Button 
            onClick={onNext}
            variant="outline"
            disabled={!hasNext}
          >
            {nextLabel}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
