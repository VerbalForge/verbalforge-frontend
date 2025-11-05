'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2 } from 'lucide-react';
import { adminService, Word } from '@/lib/services/adminService';
import { DataTable, Column } from '@/components/admin/DataTable';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { WordFormDialog } from '@/components/admin/WordFormDialog';
import { AdminFilters, FilterConfig } from '@/components/admin/AdminFilters';
import { BulkActionsBar, createDeleteAction } from '@/components/admin/BulkActionsBar';
import { useAdminEntity } from '@/hooks/useAdminEntity';
import { useDialog } from '@/hooks/useDialog';
import { useAddButton } from '../layout';

export default function WordsManagement() {
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  
  // Use the admin entity hook
  const {
    entities: words,
    loading,
    totalPages,
    currentPage,
    setCurrentPage,
    filters,
    updateFilters,
    resetFilters,
    selectedIds,
    handleSelectAll,
    handleSelectOne,
    deleteEntity,
    bulkDelete,
    actionLoading,
    reload,
  } = useAdminEntity<Word, Record<string, unknown>>(
    {
      entityName: 'Word',
      entityNamePlural: 'words',
      loadFn: async (filters) => {
        const response = await adminService.getWords(filters);
        return { data: response.words, total: response.total };
      },
      deleteFn: (id) => adminService.deleteWord(id),
    },
    { search: '', sources: [], difficulty: '' }
  );

  // Dialogs
  const deleteDialog = useDialog<Word>();
  const bulkDeleteDialog = useDialog();
  const formDialog = useDialog<Word>();
  
  const { setOnAddClick } = useAddButton();

  // Load available sources
  useEffect(() => {
    const loadSources = async () => {
      try {
        const response = await adminService.getWords({ limit: 10000 });
        const sources = new Set<string>();
        response.words.forEach(word => {
          word.sources?.forEach(source => {
            if (source && source.trim()) {
              sources.add(source);
            }
          });
        });
        setAvailableSources(Array.from(sources).sort());
      } catch (error) {
        console.error('Failed to load sources:', error);
      }
    };
    loadSources();
  }, []);

  // Set up add button - only depend on the stable open function
  useEffect(() => {
    setOnAddClick(() => formDialog.open);
    return () => setOnAddClick(null);
  }, [setOnAddClick, formDialog.open]);

  // Filter configuration - memoized to prevent recreation
  const filterConfigs: FilterConfig[] = useMemo(() => [
    {
      type: 'search',
      key: 'search',
      label: 'Search',
      placeholder: 'Search by word...',
    },
    {
      type: 'multiselect',
      key: 'sources',
      label: 'Sources',
      placeholder: 'Filter by sources...',
      options: availableSources,
    },
  ], [availableSources]);

  // Memoize the onChange handler
  const handleFilterChange = useCallback((key: string, value: string | string[]) => {
    updateFilters({ [key]: value });
  }, [updateFilters]);

  // Bulk actions configuration
  const bulkActions = useMemo(() => [
    createDeleteAction(() => bulkDeleteDialog.open()),
  ], [bulkDeleteDialog]);

  // Table columns
  const columns: Column<Word>[] = [
    {
      key: 'select',
      header: () => (
        <Checkbox
          checked={words && words.length > 0 && selectedIds.size === words.length}
          onCheckedChange={handleSelectAll}
        />
      ),
      render: (word: Word) => (
        <Checkbox
          checked={selectedIds.has(word.id)}
          onCheckedChange={(checked) => handleSelectOne(word.id, checked as boolean)}
        />
      ),
    },
    {
      key: 'word',
      header: 'Word',
      render: (word: Word) => (
        <span className="font-medium">{word.word}</span>
      ),
    },
    {
      key: 'meanings',
      header: 'Meanings',
      render: (word: Word) => (
        <div className="max-w-md">
          {word.meanings && word.meanings.length > 0 ? (
            <p className="text-sm line-clamp-2">
              {word.meanings[0].definition}
              {word.meanings.length > 1 && ` (+${word.meanings.length - 1} more)`}
            </p>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'sources',
      header: 'Sources',
      render: (word: Word) => (
        <div className="flex flex-wrap gap-1">
          {word.sources?.slice(0, 3).map((source, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {source}
            </Badge>
          ))}
          {word.sources && word.sources.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{word.sources.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (word: Word) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formDialog.open(word)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteDialog.open(word)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      <BulkActionsBar
        selectedCount={selectedIds.size}
        entityNamePlural="words"
        actions={bulkActions}
        loading={actionLoading}
      />

      {/* Filters */}
      <AdminFilters
        configs={filterConfigs}
        values={filters as Record<string, string | string[]>}
        onChange={handleFilterChange}
        onReset={resetFilters}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={words}
        loading={loading}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
        emptyMessage="No words found"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.setIsOpen}
        onConfirm={async () => {
          if (deleteDialog.item) {
            await deleteEntity(deleteDialog.item.id);
            deleteDialog.close();
          }
        }}
        title="Delete Word"
        description={
          deleteDialog.item
            ? `Are you sure you want to delete "${deleteDialog.item.word}"? This action cannot be undone.`
            : ''
        }
      />

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={bulkDeleteDialog.isOpen}
        onOpenChange={bulkDeleteDialog.setIsOpen}
        onConfirm={async () => {
          await bulkDelete();
          bulkDeleteDialog.close();
        }}
        title="Delete Multiple Words"
        description={`Are you sure you want to delete ${selectedIds.size} selected words? This action cannot be undone.`}
      />

      {/* Word Form Dialog */}
      <WordFormDialog
        open={formDialog.isOpen}
        onClose={formDialog.close}
        onSuccess={async () => {
          await reload();
          formDialog.close();
        }}
        word={formDialog.item || undefined}
      />
    </div>
  );
}
