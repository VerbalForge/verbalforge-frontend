import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PracticeFiltersProps {
  difficultyFilter: string;
  typeFilter: string;
  showNew: boolean;
  onDifficultyChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onShowNewToggle: () => void;
}

export function PracticeFilters({
  difficultyFilter,
  typeFilter,
  showNew,
  onDifficultyChange,
  onTypeChange,
  onShowNewToggle,
}: PracticeFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <Label htmlFor="difficulty-filter" className="text-sm font-medium">
          Difficulty:
        </Label>
        <Select value={difficultyFilter} onValueChange={onDifficultyChange}>
          <SelectTrigger id="difficulty-filter" className="w-[140px]">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="type-filter" className="text-sm font-medium">
          Type:
        </Label>
        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger id="type-filter" className="w-[200px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="text_completion">Text Completion</SelectItem>
            <SelectItem value="sentence_equivalence">Sentence Equivalence</SelectItem>
            <SelectItem value="reading_comprehension">Reading Comprehension</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant={showNew ? 'default' : 'outline'} onClick={onShowNewToggle} size="sm">
        Show New Only
      </Button>
    </div>
  );
}
