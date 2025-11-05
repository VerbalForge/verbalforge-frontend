'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2 } from 'lucide-react';
import { adminService, Word, WordFilters } from '@/lib/services/adminService';
import { DataTable, Column } from '@/components/admin/DataTable';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { MultiSelect } from '@/components/ui/multi-select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { WordFormDialog } from '@/components/admin/WordFormDialog';
import { useAddButton } from '../layout';


const ITEMS_PER_PAGE = 20;

export default function WordsManagement() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    sources: [] as string[],
    difficulty: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [wordToDelete, setWordToDelete] = useState<Word | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [wordToEdit, setWordToEdit] = useState<Word | null>(null);
  
  const { setOnAddClick } = useAddButton();

  // Load all available sources (run once on mount)
  const loadAvailableSources = async () => {
    try {
      // Fetch a large number of words to get all unique sources
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

  const loadWords = async () => {
    setLoading(true);
    try {
      const queryFilters: WordFilters = {
        limit: ITEMS_PER_PAGE,
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
      };

      if (filters.search) queryFilters.search = filters.search;
      if (filters.sources.length > 0) queryFilters.sources = filters.sources;
      if (filters.difficulty) queryFilters.difficulty = filters.difficulty;

      const response = await adminService.getWords(queryFilters);
      setWords(response.words);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load words:', error);
      toast.error('Failed to load words');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailableSources();
  }, []);

  useEffect(() => {
    loadWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      sources: [],
      difficulty: '',
    });
    setCurrentPage(1);
  };

  const handleDelete = (word: Word) => {
    setWordToDelete(word);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!wordToDelete) return;

    try {
      await adminService.deleteWord(wordToDelete.id);
      toast.success('Word deleted successfully');
      setDeleteDialogOpen(false);
      setWordToDelete(null);
      loadWords();
    } catch (error) {
      console.error('Failed to delete word:', error);
      toast.error('Failed to delete word');
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) {
      toast.error('Please select words to delete');
      return;
    }
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) => adminService.deleteWord(id))
      );
      toast.success(`${selectedIds.size} words deleted successfully`);
      setBulkDeleteDialogOpen(false);
      setSelectedIds(new Set());
      loadWords();
    } catch (error) {
      console.error('Failed to delete words:', error);
      toast.error('Failed to delete some words');
    }
  };

  const handleEdit = (word: Word) => {
    setWordToEdit(word);
    setFormDialogOpen(true);
  };

  const handleCreate = () => {
    setWordToEdit(null);
    setFormDialogOpen(true);
  };

  // Set the add button handler
  useEffect(() => {
    setOnAddClick(() => handleCreate);
    return () => setOnAddClick(null);
  }, [setOnAddClick]);

  const handleFormClose = () => {
    setFormDialogOpen(false);
    setWordToEdit(null);
  };

  const handleFormSuccess = () => {
    loadWords();
    handleFormClose();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(words.map((w) => w.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const columns: Column<Word>[] = [
    {
      key: 'select',
      header: () => (
        <Checkbox
          checked={words && selectedIds.size === words.length && words.length > 0}
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
      render: (word: Word) => <span className="font-semibold">{word.word}</span>,
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
          {word.sources && word.sources.length > 0 ? (
            word.sources.filter(s => s && s.trim()).slice(0, 2).map((source: string) => (
              <Badge key={source} variant="outline" className="text-xs">
                {source}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
          {word.sources && word.sources.filter(s => s && s.trim()).length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{word.sources.filter(s => s && s.trim()).length - 2}
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
            onClick={() => handleEdit(word)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(word)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedIds.size} word{selectedIds.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex justify-between items-end gap-2">
        <div className="flex gap-2 items-end">
          <div>
            <label className="text-sm font-medium mb-2 block">Search</label>
            <Input
              placeholder="Search by word..."
              value={filters.search}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, search: e.target.value }));
                setCurrentPage(1);
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Sources</label>
            <MultiSelect
              options={availableSources}
              selected={filters.sources}
              onSelectionChange={(selected) => {
                setFilters(prev => ({ ...prev, sources: selected }));
                setCurrentPage(1);
              }}
              placeholder="Filter by sources..."
            />
          </div>
        </div>
        <div>
          <Button
            variant="outline"
            onClick={handleResetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </div>

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
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Word"
        description={
          wordToDelete
            ? `Are you sure you want to delete "${wordToDelete.word}"? This action cannot be undone.`
            : ''
        }
      />

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={confirmBulkDelete}
        title="Delete Multiple Words"
        description={`Are you sure you want to delete ${selectedIds.size} selected words? This action cannot be undone.`}
      />

      {/* Word Form Dialog */}
      <WordFormDialog
        open={formDialogOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        word={wordToEdit}
      />
    </div>
  );
}
