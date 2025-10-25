import { useState, useEffect, useCallback } from 'react';
import { PracticeItem, PracticeResponse } from '@/lib/models';
import { practiceService } from '@/lib/services/practiceService';

interface PracticeFilters {
  difficulty: string;
  type: string;
  page: number;
}

export function usePracticeContent() {
  const [items, setItems] = useState<PracticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Initialize filters from sessionStorage
  const getInitialFilters = (): PracticeFilters => {
    const savedFilters = sessionStorage.getItem('practiceFilters');
    if (savedFilters) {
      try {
        return JSON.parse(savedFilters);
      } catch (err) {
        console.error('Failed to restore filters:', err);
      }
    }
    return { difficulty: 'all', type: 'all', page: 1 };
  };

  const initialFilters = getInitialFilters();
  const [page, setPage] = useState(initialFilters.page);
  const [difficultyFilter, setDifficultyFilter] = useState(initialFilters.difficulty);
  const [typeFilter, setTypeFilter] = useState(initialFilters.type);

  const fetchPracticeItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: PracticeResponse = await practiceService.getPracticeItems({
        page,
        limit: 20,
        difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
      });

      setItems(response.items || []);
      setTotal(response.total || 0);
      setTotalPages(response.total_pages || 1);
    } catch (err) {
      setError('Failed to load content. Please try again.');
      console.error('Error fetching practice items:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, difficultyFilter, typeFilter]);

  useEffect(() => {
    fetchPracticeItems();
  }, [fetchPracticeItems]);

  const handleDifficultyChange = (value: string) => {
    setDifficultyFilter(value);
    setPage(1);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const saveFiltersToSession = () => {
    sessionStorage.setItem('practiceFilters', JSON.stringify({
      difficulty: difficultyFilter,
      type: typeFilter,
      page,
    }));
  };

  return {
    items,
    loading,
    error,
    page,
    totalPages,
    total,
    difficultyFilter,
    typeFilter,
    setPage: handlePageChange,
    handleDifficultyChange,
    handleTypeChange,
    fetchPracticeItems,
    saveFiltersToSession,
  };
}
