// src/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';

type ShortcutHandler = (event: KeyboardEvent) => void;

interface ShortcutMap {
  [key: string]: ShortcutHandler; // e.g., 'Control+p', 'Meta+s'
}

export const useKeyboardShortcuts = (shortcuts: ShortcutMap) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey, altKey, shiftKey } = event;

      // Construct a key string for lookup
      let keyString = '';
      if (ctrlKey) keyString += 'Control+';
      if (metaKey) keyString += 'Meta+'; // Cmd key on Mac
      if (altKey) keyString += 'Alt+';
      if (shiftKey) keyString += 'Shift+';
      keyString += key.toLowerCase();

      if (shortcuts[keyString]) {
        event.preventDefault(); // Prevent default browser action (e.g., print dialog for Ctrl+P)
        shortcuts[keyString](event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};
