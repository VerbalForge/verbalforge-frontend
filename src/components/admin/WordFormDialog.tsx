import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import { adminService, Word, WordMeaning } from '@/lib/services/adminService';
import { TagListInput } from '@/components/admin/TagListInput';
import { toast } from 'sonner';
import { validators, validateFormData } from '@/lib/utils/formValidation';

interface WordFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  word?: Word | null;
}

export function WordFormDialog({ open, onClose, onSuccess, word }: WordFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    word: '',
    pronunciation: '',
    meanings: [] as WordMeaning[],
    synonyms: [] as string[],
    antonyms: [] as string[],
    sources: [] as string[],
  });

  const [newMeaning, setNewMeaning] = useState({ partOfSpeech: '', definition: '', example: '' });

  useEffect(() => {
    if (word) {
      setFormData({
        word: word.word || '',
        pronunciation: word.pronunciation || '',
        meanings: word.meanings || [],
        synonyms: word.synonyms || [],
        antonyms: word.antonyms || [],
        sources: word.sources || [],
      });
    } else {
      setFormData({
        word: '',
        pronunciation: '',
        meanings: [],
        synonyms: [],
        antonyms: [],
        sources: [],
      });
    }
  }, [word, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateFormData([
      () => validators.required(formData.word, 'a word'),
      () => validators.arrayNotEmpty(formData.meanings, 'meaning'),
    ]);

    if (!isValid) return;

    setLoading(true);
    try {
      if (word) {
        await adminService.updateWord(word.id, formData);
        toast.success('Word updated successfully');
      } else {
        await adminService.createWord(formData);
        toast.success('Word created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save word:', error);
      toast.error('Failed to save word');
    } finally {
      setLoading(false);
    }
  };

  const addMeaning = () => {
    if (!validators.required(newMeaning.definition, 'a definition')) return;

    setFormData((prev) => ({
      ...prev,
      meanings: [...prev.meanings, newMeaning],
    }));
    setNewMeaning({ partOfSpeech: '', definition: '', example: '' });
  };

  const removeMeaning = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      meanings: prev.meanings.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{word ? 'Edit Word' : 'Add New Word'}</DialogTitle>
          <DialogDescription>
            {word ? 'Update the word details below' : 'Enter the details for the new word'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="word">Word *</Label>
              <Input
                id="word"
                value={formData.word}
                onChange={(e) => setFormData((prev) => ({ ...prev, word: e.target.value }))}
                placeholder="Enter word"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pronunciation">Pronunciation</Label>
              <Input
                id="pronunciation"
                value={formData.pronunciation}
                onChange={(e) => setFormData((prev) => ({ ...prev, pronunciation: e.target.value }))}
                placeholder="e.g., /əˈbāt/"
              />
            </div>
          </div>

          {/* Meanings */}
          <div className="space-y-3">
            <Label>Meanings * ({formData.meanings.length})</Label>
            
            {/* Display existing meanings */}
            {formData.meanings.map((meaning, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{meaning.partOfSpeech}</p>
                    <p className="text-sm">{meaning.definition}</p>
                    {meaning.example && (
                      <p className="text-xs text-muted-foreground italic mt-1">• {meaning.example}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMeaning(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Add new meaning */}
            <div className="p-3 border rounded-lg border-dashed space-y-2">
              <Input
                placeholder="Part of speech (e.g., noun, verb, adjective)"
                value={newMeaning.partOfSpeech}
                onChange={(e) => setNewMeaning((prev) => ({ ...prev, partOfSpeech: e.target.value }))}
              />
              <Textarea
                placeholder="Enter definition"
                value={newMeaning.definition}
                onChange={(e) => setNewMeaning((prev) => ({ ...prev, definition: e.target.value }))}
                rows={2}
              />
              <Input
                placeholder="Example (optional)"
                value={newMeaning.example}
                onChange={(e) => setNewMeaning((prev) => ({ ...prev, example: e.target.value }))}
              />
              <Button type="button" onClick={addMeaning} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Meaning
              </Button>
            </div>
          </div>

          {/* Synonyms */}
          <TagListInput
            label="Synonyms"
            placeholder="Add synonym"
            tags={formData.synonyms}
            onTagsChange={(synonyms) => setFormData((prev) => ({ ...prev, synonyms }))}
          />

          {/* Antonyms */}
          <TagListInput
            label="Antonyms"
            placeholder="Add antonym"
            tags={formData.antonyms}
            onTagsChange={(antonyms) => setFormData((prev) => ({ ...prev, antonyms }))}
          />

          {/* Sources */}
          <TagListInput
            label="Sources"
            placeholder="Add source"
            tags={formData.sources}
            onTagsChange={(sources) => setFormData((prev) => ({ ...prev, sources }))}
          />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : word ? 'Update Word' : 'Create Word'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
