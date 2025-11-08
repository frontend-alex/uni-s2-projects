import { useCallback, useRef, useEffect } from 'react';

interface UseAutoSaveOptions {
  documentId: number;
  enabled?: boolean;
  onSave: (content: string) => Promise<void>;
  localStorageKey: string;
}

/**
 * Reusable auto-save hook that handles:
 * - Immediate localStorage save
 * - Debounced backend save
 * - Cleanup on unmount
 * 
 * Uses the same logic as Document.tsx:
 * - 300ms delay if idle > 5s
 * - 500ms delay if actively editing
 */
export function useAutoSave({
  documentId,
  enabled = true,
  onSave,
  localStorageKey,
}: UseAutoSaveOptions) {
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<number>(Date.now());

  // Save to localStorage
  const saveToLocalStorage = useCallback(
    (content: string) => {
      try {
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({ content, lastModified: Date.now() })
        );
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
    },
    [localStorageKey]
  );

  // Clear localStorage
  const clearLocalDraft = useCallback(() => {
    try {
      localStorage.removeItem(localStorageKey);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }, [localStorageKey]);

  // Load from localStorage
  const loadFromLocalStorage = useCallback((): { content: string; lastModified: number } | null => {
    try {
      const stored = localStorage.getItem(localStorageKey);
      if (!stored) return null;

      const data = JSON.parse(stored);
      return data;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return null;
    }
  }, [localStorageKey]);

  // Handle content change with auto-save
  const handleChange = useCallback(
    (content: string) => {
      if (!enabled || !documentId) return;

      // Save to localStorage immediately
      saveToLocalStorage(content);

      // Clear any pending save
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      const timeSinceLastSave = Date.now() - lastSaveRef.current;
      const debounceDelay = timeSinceLastSave > 5000 ? 300 : 500; 

      // Schedule backend save
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          await onSave(content);
          clearLocalDraft();
          lastSaveRef.current = Date.now();
        } catch (error) {
          console.error('Failed to save:', error);
        }
      }, debounceDelay);
    },
    [enabled, documentId, onSave, saveToLocalStorage, clearLocalDraft]
  );

  // Reset debounce when document changes
  useEffect(() => {
    if (documentId) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
    }
  }, [documentId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    handleChange,
    saveToLocalStorage,
    clearLocalDraft,
    loadFromLocalStorage,
  };
}

