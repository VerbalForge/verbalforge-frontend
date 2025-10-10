import { PartialPassage, UserPassageProgress } from "@/lib/models/passage";
import { PracticeCard } from "./PracticeCard";
import { isNewContent } from "@/lib/utils/contentUtils";

interface PassageCardProps {
  passage: PartialPassage;
  progress?: UserPassageProgress;
  onClick: () => void;
}

export function PassageCard({ passage, progress, onClick }: PassageCardProps) {
  const isNew = isNewContent(passage.created_at);
  
  // Show total questions if not attempted, otherwise show solved count
  const questionCountText = progress && progress.attempted
    ? `${progress.solvedQuestionIds.length}/${progress.totalQuestions} solved`
    : `${passage.question_ids.length} ${passage.question_ids.length === 1 ? 'question' : 'questions'}`;

  return (
    <PracticeCard
      onClick={onClick}
      type="reading_comprehension"
      difficulty={passage.difficulty}
      title=""
      preview={passage.title}
      subtitle={questionCountText}
      isNew={isNew}
      isSolved={progress?.solved || false}
      isAttempted={progress?.attempted || false}
    />
  );
}
