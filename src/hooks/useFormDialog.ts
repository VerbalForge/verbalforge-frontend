import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UseFormDialogOptions<T> {
  open: boolean;
  item?: T | null;
  initialData: () => Partial<T>;
  extractData?: (item: T) => Partial<T>;
}

export function useFormDialog<T>({
  open,
  item,
  initialData,
  extractData,
}: UseFormDialogOptions<T>) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<T>>(initialData());

  useEffect(() => {
    if (item && extractData) {
      setFormData(extractData(item));
    } else {
      setFormData(initialData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, open]);

  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (
    onSubmit: (data: Partial<T>) => Promise<void>,
    validate?: () => boolean
  ) => {
    if (validate && !validate()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    setLoading,
    updateField,
    handleSubmit,
  };
}
