import { useState, useEffect } from 'react';

interface HistoryItem {
  id: string;
  content: string;
  user: string;
  time: string;
  media?: string;
  mediaType?: string;
  videoUrl?: string;
  type?: string;
}

export const useWatchHistory = () => {
  const [watchHistory, setWatchHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const history = localStorage.getItem('watchHistory');
      if (history) {
        setWatchHistory(JSON.parse(history));
      }
    }
  }, []);

  const addToWatchHistory = (item: HistoryItem) => {
    if (typeof window === 'undefined') return;

    const newHistory = [item, ...watchHistory.filter(h => h.id !== item.id)].slice(0, 50);
    setWatchHistory(newHistory);
    localStorage.setItem('watchHistory', JSON.stringify(newHistory));
  };

  return { watchHistory, addToWatchHistory };
};
