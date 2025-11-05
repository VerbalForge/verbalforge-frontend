import { toast } from 'sonner';

export const validators = {
  required: (value: string, fieldName: string): boolean => {
    if (!value.trim()) {
      toast.error(`Please enter ${fieldName}`);
      return false;
    }
    return true;
  },

  arrayNotEmpty: (arr: unknown[], fieldName: string): boolean => {
    if (arr.length === 0) {
      toast.error(`Please add at least one ${fieldName}`);
      return false;
    }
    return true;
  },

  allArrayItemsNotEmpty: (arr: { option: string }[], fieldName: string = 'options'): boolean => {
    if (arr.some(item => !item.option.trim())) {
      toast.error(`Please fill in all ${fieldName}`);
      return false;
    }
    return true;
  },
};

export const validateFormData = (
  validations: Array<() => boolean>
): boolean => {
  return validations.every(validation => validation());
};
