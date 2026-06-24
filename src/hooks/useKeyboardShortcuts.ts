/**
 * useKeyboardShortcuts Hook
 * Keyboard events'i handle eder (Ctrl+S, Delete, Ctrl+Z, vb)
 */

import { useEffect } from 'react';

interface KeyboardShortcutsConfig {
  onSave?: () => void;
  onDelete?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSelectAll?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onSave,
  onDelete,
  onUndo,
  onRedo,
  onSelectAll,
  enabled = true,
}: KeyboardShortcutsConfig) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S / Cmd+S → Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave?.();
      }
      // Delete → Delete selected element
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onDelete?.();
      }
      // Ctrl+Z / Cmd+Z → Undo
      else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo?.();
      }
      // Ctrl+Shift+Z / Cmd+Shift+Z → Redo
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'y') && e.shiftKey) {
        e.preventDefault();
        onRedo?.();
      }
      // Ctrl+A / Cmd+A → Select All
      else if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        onSelectAll?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave, onDelete, onUndo, onRedo, onSelectAll, enabled]);
}
