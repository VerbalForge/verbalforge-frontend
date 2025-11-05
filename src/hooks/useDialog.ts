import { useState, useCallback } from 'react';

export function useDialog<TItem = unknown>() {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<TItem | null>(null);

  // These callbacks are stable - they never change
  const open = useCallback((itemToSet?: TItem) => {
    setItem(itemToSet ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setItem(null);
  }, []);

  // Return object with stable functions
  // Only isOpen and item will change, not the functions
  return {
    isOpen,
    item,
    open,
    close,
    setIsOpen,
  };
}
