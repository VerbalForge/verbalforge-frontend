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
import { adminService } from '@/lib/services/adminService';
import { Passage } from '@/lib/models/passage';
import { DifficultySelect } from '@/components/admin/DifficultySelect';
import { toast } from 'sonner';
import { validators, validateFormData } from '@/lib/utils/formValidation';

interface PassageFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  passage?: Passage | null;
}

export function PassageFormDialog({ open, onClose, onSuccess, passage }: PassageFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    passage: '',
    source: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    type: '',
  });

  useEffect(() => {
    if (passage) {
      setFormData({
        title: passage.title || '',
        passage: passage.passage || '',
        source: passage.source || '',
        difficulty: passage.difficulty as 'easy' | 'medium' | 'hard',
        type: passage.type || '',
      });
    } else {
      setFormData({
        title: '',
        passage: '',
        source: '',
        difficulty: 'medium',
        type: '',
      });
    }
  }, [passage, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateFormData([
      () => validators.required(formData.title, 'a title'),
      () => validators.required(formData.passage, 'passage text'),
      () => validators.required(formData.source, 'a source'),
    ]);

    if (!isValid) return;

    setLoading(true);
    try {
      const passageData = {
        title: formData.title,
        passage: formData.passage,
        source: formData.source,
        difficulty: formData.difficulty,
        type: formData.type || undefined,
      };

      if (passage) {
        await adminService.updatePassage(passage.id, passageData);
        toast.success('Passage updated successfully');
      } else {
        await adminService.createPassage(passageData);
        toast.success('Passage created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save passage:', error);
      toast.error('Failed to save passage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{passage ? 'Edit Passage' : 'Create New Passage'}</DialogTitle>
          <DialogDescription>
            {passage ? 'Update the passage details below' : 'Enter the details for the new passage'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter passage title"
              className="mt-2"
              required
            />
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-3 gap-4">
            <DifficultySelect
              value={formData.difficulty}
              onChange={(value) => setFormData((prev) => ({ ...prev, difficulty: value }))}
            />

            <div className="space-y-2">
              <Label htmlFor="source">Source *</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData((prev) => ({ ...prev, source: e.target.value }))}
                placeholder="e.g., Scientific American"
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                placeholder="e.g., Science, History"
                className="mt-2"
              />
            </div>
          </div>

          {/* Passage Text */}
          <div className="space-y-2">
            <Label htmlFor="passage">Passage Text *</Label>
            <Textarea
              id="passage"
              value={formData.passage}
              onChange={(e) => setFormData((prev) => ({ ...prev, passage: e.target.value }))}
              placeholder="Enter the full passage text"
              rows={12}
              className="mt-2 font-serif"
            />
            <p className="text-xs text-muted-foreground">
              Word count: {formData.passage.trim().split(/\s+/).filter(Boolean).length}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : passage ? 'Update Passage' : 'Create Passage'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
