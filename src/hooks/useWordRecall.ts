'use client';

import { useState, useEffect } from 'react';
import { userWordService } from '@/lib/services/userWordService';
import { toast } from 'sonner';

export type RecallStatus = 'recalled' | 'not-recalled' | null;

interface WordRecallData {
  [wordId: string]: {
    status: RecallStatus;
    timestamp: number;
  };
}

const STORAGE_KEY = 'word-recall-status';

export function useWordRecall() {
  const [recallData, setRecallData] = useState<WordRecallData>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load and sync data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // First load from localStorage for immediate UI response
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setRecallData(JSON.parse(stored));
        }

        // Then sync with backend
        const backendData = await userWordService.getUserProgress();
        if (backendData) {
          const syncedData: WordRecallData = {};
          
          // Map backend data to our format
          backendData.known.forEach(wordId => {
            syncedData[wordId] = {
              status: 'recalled',
              timestamp: Date.now()
            };
          });
          
          backendData.practice.forEach(wordId => {
            syncedData[wordId] = {
              status: 'not-recalled',
              timestamp: Date.now()
            };
          });

          setRecallData(syncedData);
        }
      } catch (error) {
        console.error('Error loading word recall data:', error);
        // Continue with localStorage data if backend fails
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recallData));
    } catch (error) {
      console.error('Error saving recall data:', error);
    }
  }, [recallData]);

  const setWordRecall = async (wordId: string, status: RecallStatus) => {
    // Update local state immediately for responsive UI
    setRecallData(prev => ({
      ...prev,
      [wordId]: {
        status,
        timestamp: Date.now()
      }
    }));

    // Sync with backend
    try {
      if (status === 'recalled') {
        await userWordService.updateWordStatus(wordId, 'known');
      } else if (status === 'not-recalled') {
        await userWordService.updateWordStatus(wordId, 'practice');
      } else if (status === null) {
        await userWordService.updateWordStatus(wordId, 'reset');
      }
    } catch (error) {
      console.error('Error syncing word status with backend:', error);
      toast.error('Failed to save progress. Changes saved locally.');
      // Keep the local change even if backend sync fails
    }
  };

  const getWordRecall = (wordId: string): RecallStatus => {
    return recallData[wordId]?.status || null;
  };

  const clearWordRecall = (wordId: string) => {
    setRecallData(prev => {
      const newData = { ...prev };
      delete newData[wordId];
      return newData;
    });
  };

  const clearAllRecalls = () => {
    setRecallData({});
  };

  const resetProgress = async () => {
    try {
      // Clear local state immediately
      setRecallData({});
      localStorage.removeItem(STORAGE_KEY);
      
      // Sync with backend
      await userWordService.resetProgress();
      toast.success('Progress reset successfully');
    } catch (error) {
      console.error('Error resetting progress:', error);
      toast.error('Failed to reset progress on server. Local data cleared.');
    }
  };

  const getRecallStats = () => {
    const statuses = Object.values(recallData);
    const recalled = statuses.filter(item => item.status === 'recalled').length;
    const notRecalled = statuses.filter(item => item.status === 'not-recalled').length;
    const total = statuses.length;
    
    return {
      recalled,
      notRecalled,
      total,
      percentage: total > 0 ? Math.round((recalled / total) * 100) : 0
    };
  };

  return {
    setWordRecall,
    getWordRecall,
    clearWordRecall,
    clearAllRecalls,
    resetProgress,
    getRecallStats,
    isLoaded
  };
}