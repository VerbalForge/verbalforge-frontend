'use client';

import { Question } from '@/lib/models/question';
import { Passage } from '@/lib/models/passage';
import { RCSingleChoiceQuestion } from './RCSingleChoiceQuestion';
import { RCMultipleChoiceQuestion } from './RCMultipleChoiceQuestion';

interface ReadingComprehensionQuestionProps {
  question: Question;
  passage: Passage | null;
  passageId?: string;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

/**
 * Smart wrapper component that routes to the appropriate RC question type:
 * - RCSingleChoiceQuestion: For single selection (including highlight)
 * - RCMultipleChoiceQuestion: For multiple selection
 */
export function ReadingComprehensionQuestion({
  question,
  passage,
  passageId,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
}: ReadingComprehensionQuestionProps) {
  // Determine question type from question_type field
  const questionTypeLower = question.question_type.toLowerCase();
  const isMultipleSelection = questionTypeLower.includes('multiple');

  // Route to appropriate component
  if (isMultipleSelection) {
    return (
      <RCMultipleChoiceQuestion
        question={question}
        passage={passage}
        passageId={passageId}
        onNext={onNext}
        onPrev={onPrev}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />
    );
  }

  return (
    <RCSingleChoiceQuestion
      question={question}
      passage={passage}
      passageId={passageId}
      onNext={onNext}
      onPrev={onPrev}
      hasNext={hasNext}
      hasPrev={hasPrev}
    />
  );
}
