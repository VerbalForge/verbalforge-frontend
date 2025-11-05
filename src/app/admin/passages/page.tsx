'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2 } from 'lucide-react';
import { adminService, AdminPassage } from '@/lib/services/adminService';
import { DataTable, Column } from '@/components/admin/DataTable';
import { PublishToggle } from '@/components/admin/PublishToggle';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { PassageFormDialog } from '@/components/admin/PassageFormDialog';
import { AdminFilters, FilterConfig } from '@/components/admin/AdminFilters';
import { BulkActionsBar, createPublishAction, createUnpublishAction, createDeleteAction } from '@/components/admin/BulkActionsBar';
import { useAdminEntity } from '@/hooks/useAdminEntity';
import { useDialog } from '@/hooks/useDialog';
import { useAddButton } from '../layout';

export default function PassagesManagement() {
  // Use the admin entity hook
  const {
    entities: passages,
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
    togglePublish,
    bulkPublish,
    actionLoading,
    reload,
  } = useAdminEntity<AdminPassage, Record<string, unknown>>(
    {
      entityName: 'Passage',
      entityNamePlural: 'passages',
      loadFn: async (filters) => {
        const response = await adminService.getPassages(filters);
        return { data: response.passages, total: response.total };
      },
      deleteFn: (id) => adminService.deletePassage(id),
      bulkDeleteFn: (ids) => adminService.bulkDeletePassages(ids),
      publishFn: (id, published) => adminService.publishPassage(id, published),
      bulkPublishFn: async (ids, published) => {
        await Promise.all(ids.map(id => adminService.publishPassage(id, published)));
      },
    },
    { published: '', difficulty: '', search: '' }
  );

  // Dialogs
  const deleteDialog = useDialog<AdminPassage>();
  const bulkDeleteDialog = useDialog();
  const formDialog = useDialog<AdminPassage>();
  
  const { setOnAddClick } = useAddButton();

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
      placeholder: 'Search passages...',
    },
    {
      type: 'select',
      key: 'published',
      label: 'Status',
      placeholder: 'All statuses',
      options: [
        { label: 'Published', value: 'true' },
        { label: 'Unpublished', value: 'false' },
      ],
    },
    {
      type: 'select',
      key: 'difficulty',
      label: 'Difficulty',
      placeholder: 'All difficulties',
      options: ['Easy', 'Medium', 'Hard'],
    },
  ], []);

  // Memoize the onChange handler
  const handleFilterChange = useCallback((key: string, value: string | string[]) => {
    updateFilters({ [key]: value });
  }, [updateFilters]);

  // Bulk actions configuration
  const bulkActions = useMemo(() => [
    createPublishAction(() => bulkPublish(true)),
    createUnpublishAction(() => bulkPublish(false)),
    createDeleteAction(() => bulkDeleteDialog.open()),
  ], [bulkPublish, bulkDeleteDialog]);

  // Table columns
  const columns: Column<AdminPassage>[] = [
    {
      key: 'select',
      header: () => (
        <Checkbox
          checked={passages && passages.length > 0 && selectedIds.size === passages.length}
          onCheckedChange={handleSelectAll}
        />
      ),
      render: (passage: AdminPassage) => (
        <Checkbox
          checked={selectedIds.has(passage.id)}
          onCheckedChange={(checked) => handleSelectOne(passage.id, checked as boolean)}
        />
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (passage: AdminPassage) => (
        <div className="max-w-xs">
          <p className="font-medium line-clamp-1">{passage.title}</p>
        </div>
      ),
    },
    {
      key: 'content',
      header: 'Content',
      render: (passage: AdminPassage) => (
        <div className="max-w-md">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {passage.passage}
          </p>
        </div>
      ),
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      render: (passage: AdminPassage) => {
        const colorMap: Record<string, string> = {
          easy: 'text-green-600',
          medium: 'text-yellow-600',
          hard: 'text-red-600',
        };
        return (
          <Badge variant="secondary" className={colorMap[passage.difficulty]}>
            {passage.difficulty}
          </Badge>
        );
      },
    },
    {
      key: 'questions',
      header: 'Questions',
      render: (passage: AdminPassage) => (
        <Badge variant="outline">
          {passage.question_ids?.length || 0}
        </Badge>
      ),
    },
    {
      key: 'published',
      header: 'Status',
      render: (passage) => {
        const isPublished = passage.metadata.published_at != null;
        return (
          <PublishToggle
            published={isPublished}
            onToggle={() => togglePublish(passage.id, isPublished)}
          />
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (passage: AdminPassage) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formDialog.open(passage)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteDialog.open(passage)}
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
        entityNamePlural="passages"
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
        data={passages || []}
        columns={columns}
        loading={loading}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
        emptyMessage="No passages found"
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
        itemName={deleteDialog.item?.title}
        description="This will permanently delete this passage and all associated data."
      />

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={bulkDeleteDialog.isOpen}
        onOpenChange={bulkDeleteDialog.setIsOpen}
        onConfirm={async () => {
          await bulkDelete();
          bulkDeleteDialog.close();
        }}
        itemName={`${selectedIds.size} passages`}
        description="This will permanently delete all selected passages and their associated data."
      />

      {/* Passage Form Dialog */}
      <PassageFormDialog
        open={formDialog.isOpen}
        onClose={formDialog.close}
        onSuccess={async () => {
          await reload();
          formDialog.close();
        }}
        passage={formDialog.item || undefined}
      />
    </div>
  );
}
