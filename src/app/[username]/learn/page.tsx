'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MultiSelect } from '@/components/ui/multi-select';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Word, WordsResponse, WordFilters } from '@/lib/models/word';
import { wordService } from '@/lib/services/wordService';
import { WordCard } from '@/components/learn/WordCard';
import { WordCardSkeleton } from '@/components/learn/WordCardSkeleton';
import { WordDialog } from '@/components/learn/WordDialog';
import { useWordRecall } from '@/hooks/useWordRecall';
import { toast } from 'sonner';

interface FilterState {
  sources: string[];
  search: string;
  progress: 'all' | 'known' | 'practice';
}

export default function LearnPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Use word recall hook at top level
  const { getWordRecall, setWordRecall, resetProgress } = useWordRecall();
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    sources: [],
    search: '',
    progress: 'all'
  });

  // Dialog state
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 30;

  // Debounced search
  const [searchDebounced, setSearchDebounced] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(filters.search);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch data when filters or page changes
  useEffect(() => {
    fetchWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchDebounced, filters.sources, filters.progress]);

  const fetchWords = async () => {
    try {
      setLoading(true);
      
      const wordFilters: WordFilters = {
        limit,
        search: searchDebounced,
        page: currentPage,
      };

      // Add sources filter
      if (filters.sources.length > 0) {
        wordFilters.sources = filters.sources;
      }

      // Add progress filters
      if (filters.progress === 'known') {
        wordFilters.known = true;
      } else if (filters.progress === 'practice') {
        wordFilters.practice = true;
      }

      const response: WordsResponse = await wordService.getWords(wordFilters);
      
      setWords(response.words || []);
      setAvailableSources(response.sources || []);
      setTotal(response.total || 0);
      setTotalPages(response.totalPages || 1);
      
    } catch (error) {
      toast.error('Failed to load words');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  const handleProgressFilter = (progress: 'all' | 'known' | 'practice') => {
    setFilters(prev => ({ ...prev, progress }));
    setCurrentPage(1);
  };

  const handleWordClick = (word: Word) => {
    const index = words.findIndex(w => w.id === word.id);
    setCurrentWordIndex(index);
    setSelectedWord(word);
    setIsDialogOpen(true);
  };

  const handlePreviousWord = () => {
    if (currentWordIndex > 0) {
      const newIndex = currentWordIndex - 1;
      setCurrentWordIndex(newIndex);
      setSelectedWord(words[newIndex]);
    }
  };

  const handleNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      const newIndex = currentWordIndex + 1;
      setCurrentWordIndex(newIndex);
      setSelectedWord(words[newIndex]);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleResetProgress = async () => {
    await resetProgress();
    setIsResetDialogOpen(false);
    // Optionally reload the data
    fetchWords();
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted-foreground text-lg">
            Explore vocabulary with interactive flashcards
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsResetDialogOpen(true)}
          className="text-destructive hover:text-destructive"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Progress
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Filter Dropdowns */}
        <div className="flex gap-4 flex-wrap">
          {/* Sources Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sources: </label>
            <MultiSelect
              options={availableSources}
              selected={filters.sources}
              onSelectionChange={(sources) => {
                setFilters(prev => ({ ...prev, sources }));
                setCurrentPage(1);
              }}
              placeholder="Select sources..."
              className="min-w-[250px]"
            />
          </div>

          {/* Progress Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Progress: </label>
            <MultiSelect
              options={['All Words', 'Known', 'Need Practice']}
              selected={filters.progress === 'all' ? ['All Words'] : filters.progress === 'known' ? ['Known'] : ['Need Practice']}
              onSelectionChange={(progress) => {
                if (progress.length === 0) {
                  handleProgressFilter('all');
                } else {
                  const selected = progress[0];
                  if (selected === 'All Words') handleProgressFilter('all');
                  else if (selected === 'Known') handleProgressFilter('known');
                  else if (selected === 'Need Practice') handleProgressFilter('practice');
                }
              }}
              placeholder="Select progress..."
              className="w-[180px]"
              singleSelect={true}
            />
          </div>
        </div>
      </div>

      {/* Results info and pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {words.length} of {total} words
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage <= 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || loading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Word grid - 5x6 = 30 words */}
      {loading ? (
        // Loading - show skeleton cards
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 30 }).map((_, index) => (
            <WordCardSkeleton key={index} />
          ))}
        </div>
      ) : words.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {words.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              onClick={() => handleWordClick(word)}
              getWordRecall={getWordRecall}
              setWordRecall={setWordRecall}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No words found matching your filters
          </p>
        </div>
      )}

      {/* Word Dialog */}
      <WordDialog
        word={selectedWord}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onPrevious={handlePreviousWord}
        onNext={handleNextWord}
        hasPrevious={currentWordIndex > 0}
        hasNext={currentWordIndex < words.length - 1}
        getWordRecall={getWordRecall}
        setWordRecall={setWordRecall}
      />

      {/* Reset Progress Confirmation Dialog */}
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Your Progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your
              word progress including known words and words marked for practice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetProgress}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reset Progress
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}