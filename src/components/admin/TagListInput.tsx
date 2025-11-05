import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface TagListInputProps {
  label: string;
  placeholder: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagListInput({ label, placeholder, tags, onTagsChange }: TagListInputProps) {
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (!newTag.trim()) return;
    onTagsChange([...tags, newTag.trim()]);
    setNewTag('');
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded">
            <span className="text-sm">{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button type="button" onClick={addTag} size="sm" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
