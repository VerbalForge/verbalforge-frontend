'use client';

import { Badge } from '@/components/ui/badge';

interface QuestionTypeBadgeProps {
  type: string;
  className?: string;
}

const getTypeLabel = (type: string) => {
  const typeLower = type.toLowerCase();
  
  // Handle reading comprehension variations
  if (typeLower.includes('reading_comprehension') || typeLower.includes('reading comprehension')) {
    return 'RC';
  }
  
  // Handle text completion variations
  if (typeLower.includes('text_completion') || typeLower.includes('text completion')) {
    return 'TC';
  }
  
  // Handle sentence equivalence variations
  if (typeLower.includes('sentence_equivalence') || typeLower.includes('sentence equivalence')) {
    return 'SE';
  }
  
  // Fallback for unknown types
  return type.substring(0, 2).toUpperCase();
};

const getTypeColor = (type: string) => {
  const typeLower = type.toLowerCase();
  
  // Reading Comprehension - Purple
  if (typeLower.includes('reading_comprehension') || typeLower.includes('reading comprehension')) {
    return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
  }
  
  // Text Completion - Teal
  if (typeLower.includes('text_completion') || typeLower.includes('text completion')) {
    return 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800';
  }
  
  // Sentence Equivalence - Blue
  if (typeLower.includes('sentence_equivalence') || typeLower.includes('sentence equivalence')) {
    return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
  }
  
  // Fallback - Gray
  return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800';
};

export function QuestionTypeBadge({ type, className = '' }: QuestionTypeBadgeProps) {
  const label = getTypeLabel(type);
  const colorClass = getTypeColor(type);

  return (
    <Badge 
      variant="outline" 
      className={`${colorClass} ${className}`}
    >
      {label}
    </Badge>
  );
}
