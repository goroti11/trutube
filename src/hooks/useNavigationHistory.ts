import { useState, useEffect } from 'react';

export function useNavigationHistory() {
  const [history, setHistory] = useState<string[]>([]);

  const addToHistory = (page: string) => {
    setHistory((prev) => [...prev, page]);
  };

  const goBack = (): string | null => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousPage = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      return previousPage;
    }
    return null;
  };

  const canGoBack = () => history.length > 1;

  return { addToHistory, goBack, canGoBack, history };
}
