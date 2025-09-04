// src/hooks/useCVHistory.ts
import { useState, useEffect, useCallback } from 'react';
import { CVData } from '../types/cv.types';

interface CVHistoryHook {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useCVHistory = (
  cvData: CVData,
  setCVDataDirectly: (data: CVData) => void
): CVHistoryHook => {
  const [history, setHistory] = useState<CVData[]>([cvData]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Effect to update history when cvData changes
  useEffect(() => {
    // Only add to history if cvData is different from the current history state
    // This prevents adding to history on initial load or when undo/redo is performed
    if (JSON.stringify(cvData) !== JSON.stringify(history[historyIndex])) {
      const newHistory = history.slice(0, historyIndex + 1);
      setHistory([...newHistory, cvData]);
      setHistoryIndex(newHistory.length);
    }
  }, [cvData, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCVDataDirectly(history[newIndex]);
    }
  }, [history, historyIndex, setCVDataDirectly]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCVDataDirectly(history[newIndex]);
    }
  }, [history, historyIndex, setCVDataDirectly]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return { undo, redo, canUndo, canRedo };
};
