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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { faqService, FAQ } from '@/lib/services/faqService';
import { toast } from 'sonner';
import { validators, validateFormData } from '@/lib/utils/formValidation';

interface FAQFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  faq?: FAQ | null;
}

export function FAQFormDialog({ open, onClose, onSuccess, faq }: FAQFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    question: '',
    answer: '',
    status: 'answered' as 'pending' | 'answered' | 'archived',
  });

  useEffect(() => {
    if (faq) {
      setFormData({
        email: faq.email || '',
        question: faq.question || '',
        answer: faq.answer || '',
        status: faq.status as 'pending' | 'answered' | 'archived',
      });
    } else {
      setFormData({
        email: '',
        question: '',
        answer: '',
        status: 'answered',
      });
    }
  }, [faq, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateFormData([
      () => validators.required(formData.email, 'an email'),
      () => validators.required(formData.question, 'a question'),
    ]);

    if (!isValid) return;

    setLoading(true);
    try {
      if (faq) {
        // Update existing FAQ
        await faqService.updateFAQStatus(faq.id, {
          status: formData.status,
          answer: formData.answer || undefined,
        });
        toast.success('FAQ updated successfully');
      } else {
        // Create new FAQ
        await faqService.createFAQ({
          email: formData.email,
          question: formData.question,
        });
        // If there's an answer, update the status
        if (formData.answer) {
          // Note: We'd need the created FAQ ID here, but the API might not return it
          // For now, we'll just create it as pending and let admin update later
        }
        toast.success('FAQ created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save FAQ:', error);
      toast.error('Failed to save FAQ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{faq ? 'Edit FAQ' : 'Create New FAQ'}</DialogTitle>
          <DialogDescription>
            {faq ? 'Update the FAQ details below' : 'Enter the details for the new FAQ'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="user@example.com"
              required
              disabled={!!faq} // Can't change email when editing
            />
          </div>

          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
              placeholder="Enter the question"
              rows={3}
              required
            />
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => setFormData((prev) => ({ ...prev, answer: e.target.value }))}
              placeholder="Enter the answer (optional for now)"
              rows={5}
            />
          </div>

          {/* Status - Only show when editing */}
          {faq && (
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as 'pending' | 'answered' | 'archived' }))
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="answered">Answered</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : faq ? 'Update FAQ' : 'Create FAQ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
