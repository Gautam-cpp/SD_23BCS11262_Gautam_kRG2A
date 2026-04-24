'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type UrlRecord, prependToCache, writeCache } from '@/lib/historyCache';

interface HistoryContextValue {
  history: UrlRecord[];
  setHistory: (records: UrlRecord[]) => void;
  prependLink: (userId: string, record: UrlRecord) => void;
  removeLink: (userId: string, id: string) => void;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistoryState] = useState<UrlRecord[]>([]);

  const setHistory = useCallback((records: UrlRecord[]) => {
    setHistoryState(records);
  }, []);

  const prependLink = useCallback((userId: string, record: UrlRecord) => {
    prependToCache(userId, record);
    setHistoryState((prev) => {
      const already = prev.some((r) => r.id === record.id);
      return already ? prev : [record, ...prev];
    });
  }, []);

  const removeLink = useCallback((userId: string, id: string) => {
    setHistoryState((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      writeCache(userId, updated);
      return updated;
    });
  }, []);

  return (
    <HistoryContext.Provider value={{ history, setHistory, prependLink, removeLink }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory must be used inside <HistoryProvider>');
  return ctx;
}
