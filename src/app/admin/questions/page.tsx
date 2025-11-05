'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2 } from 'lucide-react';
import { adminService, AdminQuestion } from '@/lib/services/adminService';
import { DataTable, Column } from '@/components/admin/DataTable';
import { PublishToggle } from '@/components/admin/PublishToggle';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { QuestionFormDialog } from '@/components/admin/QuestionFormDialog';
import { AdminFilters, FilterConfig } from '@/components/admin/AdminFilters';
import { BulkActionsBar, createPublishAction, createUnpublishAction, createDeleteAction } from '@/components/admin/BulkActionsBar';
import { useAdminEntity } from '@/hooks/useAdminEntity';
import { useDialog } from '@/hooks/useDialog';
import { useAddButton } from '../layout';

export default function QuestionsManagement() {
  // Use the admin entity hook
  const {
    entities: questions,
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
  } = useAdminEntity<AdminQuestion, Record<string, unknown>>(
    {
      entityName: 'Question',
      entityNamePlural: 'questions',
      loadFn: async (filters) => {
        const response = await adminService.getQuestions(filters);
        return { data: response.questions, total: response.total };
      },
      deleteFn: (id) => adminService.deleteQuestion(id),
      bulkDeleteFn: (ids) => adminService.bulkDeleteQuestions(ids),
      publishFn: (id, published) => adminService.publishQuestion(id, published),
      bulkPublishFn: async (ids, published) => {
        await Promise.all(ids.map(id => adminService.publishQuestion(id, published)));
      },
    },
    { published: '', type: '', difficulty: '', search: '' }
  );

  // Dialogs
  const deleteDialog = useDialog<AdminQuestion>();
  const bulkDeleteDialog = useDialog();
  const formDialog = useDialog<AdminQuestion>();
  
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
      placeholder: 'Search questions...',
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
      key: 'type',
      label: 'Type',
      placeholder: 'All types',
      options: [
        { label: 'Text Completion', value: 'TC' },
        { label: 'Sentence Equivalence', value: 'SE' },
        { label: 'Reading Comprehension', value: 'RC' },
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
  const columns: Column<AdminQuestion>[] = [
    {
      key: 'select',
      header: () => (
        <Checkbox
          checked={questions && questions.length > 0 && selectedIds.size === questions.length}
          onCheckedChange={handleSelectAll}
        />
      ),
      render: (question: AdminQuestion) => (
        <Checkbox
          checked={selectedIds.has(question.id)}
          onCheckedChange={(checked) => handleSelectOne(question.id, checked as boolean)}
        />
      ),
    },
    {
      key: 'question',
      header: 'Question',
      render: (question: AdminQuestion) => (
        <div className="max-w-md">
          <p className="text-sm line-clamp-2">{question.question_text}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (question: AdminQuestion) => (
        <Badge variant="outline">{question.question_type}</Badge>
      ),
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      render: (question: AdminQuestion) => {
        const colorMap: Record<string, string> = {
          easy: 'text-green-600',
          medium: 'text-yellow-600',
          hard: 'text-red-600',
        };
        return (
          <Badge variant="secondary" className={colorMap[question.difficulty_level]}>
            {question.difficulty_level}
          </Badge>
        );
      },
    },
    {
      key: 'published',
      header: 'Status',
      render: (question) => {
        const isPublished = question.metadata.published_at != null;
        return (
          <PublishToggle
            published={isPublished}
            onToggle={() => togglePublish(question.id, isPublished)}
          />
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (question: AdminQuestion) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formDialog.open(question)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteDialog.open(question)}
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
        entityNamePlural="questions"
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
        data={questions || []}
        columns={columns}
        loading={loading}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
        emptyMessage="No questions found"
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
        itemName={deleteDialog.item?.question_text.substring(0, 50) + '...'}
        description="This will permanently delete this question and all associated data."
      />

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={bulkDeleteDialog.isOpen}
        onOpenChange={bulkDeleteDialog.setIsOpen}
        onConfirm={async () => {
          await bulkDelete();
          bulkDeleteDialog.close();
        }}
        itemName={`${selectedIds.size} questions`}
        description="This will permanently delete all selected questions and their associated data."
      />

      {/* Question Form Dialog */}
      <QuestionFormDialog
        open={formDialog.isOpen}
        onClose={formDialog.close}
        onSuccess={async () => {
          await reload();
          formDialog.close();
        }}
        question={formDialog.item || undefined}
      />
    </div>
  );
}
