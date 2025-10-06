'use client';

import { PartialQuestion, UserQuestionProgress } from '@/lib/api';
import { PracticeCard } from './PracticeCard';
import { isNewContent } from '@/lib/utils/contentUtils';

interface QuestionCardProps {
  question: PartialQuestion;
  progress?: UserQuestionProgress;
  onClick?: () => void;
}

export function QuestionCard({ question, progress, onClick }: QuestionCardProps) {
  const isNew = isNewContent(question.created_at);
  
  return (
    <PracticeCard
      onClick={onClick}
      type={question.question_type}
      difficulty={question.difficulty_level}
      title=""
      preview={question.question_text}
      subtitle={question.topic}
      isNew={isNew}
      isSolved={progress?.solved || false}
      isAttempted={progress?.attempted || false}
    />
  );
}

