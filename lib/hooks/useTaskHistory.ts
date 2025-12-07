import { useState, useCallback, useRef } from 'react';
import type { Task } from '@/lib/interface/task';

interface HistoryEntry {
  type: 'create' | 'update' | 'delete' | 'status';
  task: Task;
  previousState?: Task;
  timestamp: number;
}

const MAX_HISTORY_SIZE = 50;

export function useTaskHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const historyRef = useRef<HistoryEntry[]>([]);
  const indexRef = useRef(-1);

  // Add entry to history
  const addToHistory = useCallback((entry: HistoryEntry) => {
    historyRef.current = [
      ...historyRef.current.slice(0, indexRef.current + 1),
      entry,
    ].slice(-MAX_HISTORY_SIZE);
    indexRef.current = historyRef.current.length - 1;
    setHistory(historyRef.current);
    setHistoryIndex(indexRef.current);
  }, []);

  // Undo last action
  const undo = useCallback((): HistoryEntry | null => {
    if (indexRef.current < 0) return null;
    
    const entry = historyRef.current[indexRef.current];
    indexRef.current--;
    setHistoryIndex(indexRef.current);
    
    return entry;
  }, []);

  // Redo last undone action
  const redo = useCallback((): HistoryEntry | null => {
    if (indexRef.current >= historyRef.current.length - 1) return null;
    
    indexRef.current++;
    const entry = historyRef.current[indexRef.current];
    setHistoryIndex(indexRef.current);
    
    return entry;
  }, []);

  // Check if undo is available
  const canUndo = historyIndex >= 0;
  
  // Check if redo is available
  const canRedo = historyIndex < history.length - 1;

  // Clear history
  const clearHistory = useCallback(() => {
    historyRef.current = [];
    indexRef.current = -1;
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  return {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    historyLength: history.length,
  };
}
