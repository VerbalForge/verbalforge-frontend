import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DifficultySelectProps {
  value: 'easy' | 'medium' | 'hard';
  onChange: (value: 'easy' | 'medium' | 'hard') => void;
  label?: string;
  required?: boolean;
}

export function DifficultySelect({ 
  value, 
  onChange, 
  label = 'Difficulty', 
  required = true 
}: DifficultySelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="difficulty">
        {label} {required && '*'}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="difficulty" className="mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
