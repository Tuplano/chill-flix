import { useState, useEffect } from 'react';

export interface ContinueWatchingItem {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  poster_path: string;
  backdrop_path?: string;
  season?: number;
  episode?: number;
  lastWatched: number;
}

const STORAGE_KEY = 'chill-flix-continue-watching';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export function useContinueWatching() {
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedItems: ContinueWatchingItem[] = JSON.parse(stored);
        
        // Cleanup items older than 1 week
        const now = Date.now();
        const filteredItems = parsedItems.filter(item => (now - item.lastWatched) < ONE_WEEK_MS);
        
        if (filteredItems.length !== parsedItems.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
        }
        
        setItems(filteredItems);
      } catch (e) {
        console.error('Failed to parse continue watching items', e);
      }
    }
  }, []);

  const saveProgress = (item: Omit<ContinueWatchingItem, 'lastWatched'>) => {
    const newItem = { ...item, lastWatched: Date.now() };
    
    setItems((prev) => {
      const filtered = prev.filter(
        (i) => !(i.id === item.id && i.mediaType === item.mediaType)
      );
      const updated = [newItem, ...filtered].slice(0, 20); // Keep last 20 items
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromContinueWatching = (id: number, mediaType: 'movie' | 'tv') => {
    setItems((prev) => {
      const updated = prev.filter((i) => !(i.id === id && i.mediaType === mediaType));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    items,
    saveProgress,
    removeFromContinueWatching,
  };
}
