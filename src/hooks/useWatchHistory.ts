import { useState, useEffect } from 'react';

export interface WatchHistoryItem {
  id: number;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
  timestamp: number;
}

const STORAGE_KEY = 'chill-flix-watch-history';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export function useWatchHistory() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedHistory: WatchHistoryItem[] = JSON.parse(stored);
        
        // Cleanup items older than 1 week
        const now = Date.now();
        const filteredHistory = parsedHistory.filter(item => (now - item.timestamp) < ONE_WEEK_MS);
        
        if (filteredHistory.length !== parsedHistory.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
        }

        setHistory(filteredHistory);
      } catch (e) {
        console.error('Failed to parse watch history', e);
      }
    }
  }, []);

  const markAsWatched = (item: Omit<WatchHistoryItem, 'timestamp'>) => {
    setHistory((prev) => {
      const exists = prev.some((i) => 
        i.id === item.id && 
        i.mediaType === item.mediaType && 
        (item.mediaType === 'tv' ? (i.season === item.season && i.episode === item.episode) : true)
      );

      if (exists) return prev;

      const updated = [{ ...item, timestamp: Date.now() }, ...prev].slice(0, 1000); // Keep last 1000 items
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isWatched = (id: number, mediaType: 'movie' | 'tv', season?: number, episode?: number) => {
    return history.some((i) => 
      i.id === id && 
      i.mediaType === mediaType && 
      (mediaType === 'tv' ? (i.season === season && i.episode === episode) : true)
    );
  };

  return {
    history,
    markAsWatched,
    isWatched,
  };
}
