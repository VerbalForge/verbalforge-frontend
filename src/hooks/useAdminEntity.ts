import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

export interface UseAdminEntityOptions<TEntity, TFilters> {
  entityName: string; // 'word', 'question', 'passage'
  entityNamePlural: string; // 'words', 'questions', 'passages'
  itemsPerPage?: number;
  loadFn: (filters: TFilters) => Promise<{ data: TEntity[]; total: number }>;
  deleteFn: (id: string) => Promise<unknown>;
  bulkDeleteFn?: (ids: string[]) => Promise<unknown>;
  publishFn?: (id: string, published: boolean) => Promise<unknown>;
  bulkPublishFn?: (ids: string[], published: boolean) => Promise<unknown>;
}

export function useAdminEntity<TEntity extends { id: string }, TFilters extends Record<string, unknown>>(
  options: UseAdminEntityOptions<TEntity, TFilters>,
  initialFilters: TFilters
) {
  const {
    entityName,
    entityNamePlural,
    itemsPerPage = 20,
    loadFn,
    deleteFn,
    bulkDeleteFn,
    publishFn,
    bulkPublishFn,
  } = options;

  // Use refs for functions to avoid recreating callbacks
  const loadFnRef = useRef(loadFn);
  const deleteFnRef = useRef(deleteFn);
  const bulkDeleteFnRef = useRef(bulkDeleteFn);
  const publishFnRef = useRef(publishFn);
  const bulkPublishFnRef = useRef(bulkPublishFn);

  // Update refs when functions change
  useEffect(() => {
    loadFnRef.current = loadFn;
  }, [loadFn]);

  useEffect(() => {
    deleteFnRef.current = deleteFn;
  }, [deleteFn]);

  useEffect(() => {
    bulkDeleteFnRef.current = bulkDeleteFn;
  }, [bulkDeleteFn]);

  useEffect(() => {
    publishFnRef.current = publishFn;
  }, [publishFn]);

  useEffect(() => {
    bulkPublishFnRef.current = bulkPublishFn;
  }, [bulkPublishFn]);

  const [entities, setEntities] = useState<TEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<TFilters>(initialFilters);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);

  // Load entities - use ref to avoid dependency issues
  const loadEntities = useCallback(async () => {
    setLoading(true);
    try {
      const queryFilters = {
        ...filters,
        limit: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
      } as TFilters;

      const response = await loadFnRef.current(queryFilters);
      setEntities(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error(`Failed to load ${entityNamePlural}:`, error);
      toast.error(`Failed to load ${entityNamePlural}`);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, itemsPerPage, entityNamePlural]);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setCurrentPage(1);
  }, [initialFilters]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<TFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  // Selection handlers
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(entities.map(e => e.id)));
    } else {
      setSelectedIds(new Set());
    }
  }, [entities]);

  const handleSelectOne = useCallback((id: string, checked: boolean) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  // Delete single entity
  const deleteEntity = useCallback(async (id: string) => {
    try {
      await deleteFnRef.current(id);
      toast.success(`${entityName} deleted successfully`);
      await loadEntities();
    } catch (error) {
      console.error(`Failed to delete ${entityName}:`, error);
      toast.error(`Failed to delete ${entityName}`);
      throw error;
    }
  }, [entityName, loadEntities]);

  // Bulk delete
  const bulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) {
      toast.error(`No ${entityNamePlural} selected`);
      return;
    }

    try {
      setActionLoading(true);
      const ids = Array.from(selectedIds);
      
      if (bulkDeleteFnRef.current) {
        await bulkDeleteFnRef.current(ids);
      } else {
        await Promise.all(ids.map(id => deleteFnRef.current(id)));
      }
      
      toast.success(`${selectedIds.size} ${entityNamePlural} deleted successfully`);
      setSelectedIds(new Set());
      await loadEntities();
    } catch (error) {
      console.error(`Failed to delete ${entityNamePlural}:`, error);
      toast.error(`Failed to delete ${entityNamePlural}`);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [selectedIds, entityNamePlural, loadEntities]);

  // Toggle publish status
  const togglePublish = useCallback(async (id: string, currentPublished: boolean) => {
    if (!publishFnRef.current) {
      toast.error('Publish functionality not available');
      return;
    }

    try {
      await publishFnRef.current(id, !currentPublished);
      toast.success(`${entityName} ${currentPublished ? 'unpublished' : 'published'} successfully`);
      await loadEntities();
    } catch (error) {
      console.error(`Failed to toggle publish status:`, error);
      toast.error('Failed to update publish status');
      throw error;
    }
  }, [entityName, loadEntities]);

  // Bulk publish
  const bulkPublish = useCallback(async (publish: boolean) => {
    if (selectedIds.size === 0) {
      toast.error(`No ${entityNamePlural} selected`);
      return;
    }

    if (!bulkPublishFnRef.current && !publishFnRef.current) {
      toast.error('Publish functionality not available');
      return;
    }

    try {
      setActionLoading(true);
      const ids = Array.from(selectedIds);
      
      if (bulkPublishFnRef.current) {
        await bulkPublishFnRef.current(ids, publish);
      } else if (publishFnRef.current) {
        await Promise.all(ids.map(id => publishFnRef.current!(id, publish)));
      }
      
      toast.success(`${selectedIds.size} ${entityNamePlural} ${publish ? 'published' : 'unpublished'} successfully`);
      setSelectedIds(new Set());
      await loadEntities();
    } catch (error) {
      console.error(`Failed to ${publish ? 'publish' : 'unpublish'} ${entityNamePlural}:`, error);
      toast.error(`Failed to ${publish ? 'publish' : 'unpublish'} ${entityNamePlural}`);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [selectedIds, entityNamePlural, loadEntities]);

  const totalPages = Math.ceil(total / itemsPerPage);

  // Clear selection when entities change
  useEffect(() => {
    setSelectedIds(new Set());
  }, [entities]);

  return {
    // Data
    entities,
    total,
    totalPages,
    loading,
    actionLoading,
    
    // Pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    
    // Filters
    filters,
    setFilters,
    updateFilters,
    resetFilters,
    
    // Selection
    selectedIds,
    handleSelectAll,
    handleSelectOne,
    clearSelection: () => setSelectedIds(new Set()),
    
    // Actions
    deleteEntity,
    bulkDelete,
    togglePublish,
    bulkPublish,
    reload: loadEntities,
  };
}
