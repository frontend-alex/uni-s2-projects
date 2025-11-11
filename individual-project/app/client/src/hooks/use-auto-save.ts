/**
 * Auto-Save Hook
 * 
 * Generic reusable hook for auto-saving content with the following features:
 * - Immediate localStorage save for offline support
 * - Debounced backend save to prevent excessive API calls
 * - Adaptive debounce delay (300ms if idle > 5s, 500ms if actively editing)
 * - Automatic cleanup on unmount
 * - Document change handling
 * 
 * Used by both Document and Whiteboard components for consistent save behavior.
 * 
 * @module hooks/useAutoSave
 */

import { useCallback, useRef, useEffect } from 'react';

/**
 * Configuration for useAutoSave hook
 */
interface UseAutoSaveOptions {
  /** Document ID (0 or undefined disables saving) */
  documentId: number;
  /** Whether auto-save is enabled (default: true) */
  enabled?: boolean;
  /** Async function to save content to backend */
  onSave: (content: string) => Promise<void>;
  /** localStorage key for storing draft content */
  localStorageKey: string;
}

/**
 * Return type for useAutoSave hook
 */
interface UseAutoSaveReturn {
  /** Handle content change (triggers auto-save) */
  handleChange: (content: string) => void;
  /** Manually save to localStorage */
  saveToLocalStorage: (content: string) => void;
  /** Clear localStorage draft */
  clearLocalDraft: () => void;
  /** Load content from localStorage */
  loadFromLocalStorage: () => { content: string; lastModified: number } | null;
}

/**
 * Hook for auto-saving content with debouncing and localStorage support.
 * 
 * Provides a unified auto-save solution for any content that needs to be saved
 * to both localStorage (immediate) and backend (debounced).
 * 
 * Features:
 * - Immediate localStorage save for offline support
 * - Debounced backend save (300ms if idle > 5s, 500ms if actively editing)
 * - Automatic cleanup of pending saves on unmount
 * - Document change detection and reset
 * 
 * @param options - Auto-save configuration
 * @returns Auto-save functions
 * 
 * @example
 * ```typescript
 * const { handleChange, loadFromLocalStorage } = useAutoSave({
 *   documentId: 123,
 *   enabled: true,
 *   onSave: async (content) => {
 *     await updateDocument({ content });
 *   },
 *   localStorageKey: 'doc-123-draft',
 * });
 * 
 * // Handle content changes
 * handleChange(newContent);
 * 
 * // Load draft on mount
 * const draft = loadFromLocalStorage();
 * ```
 */
export function useAutoSave({
  documentId,
  enabled = true,
  onSave,
  localStorageKey,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  // Refs for debounce timeout and last save timestamp
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<number>(Date.now());

  /**
   * Save content to localStorage immediately.
   * 
   * Stores content with a timestamp for draft detection.
   * Wrapped in try-catch to handle quota exceeded errors gracefully.
   * 
   * @param content - Content to save
   */
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

  /**
   * Clear localStorage draft.
   * 
   * Removes the stored draft content. Called after successful backend save.
   */
  const clearLocalDraft = useCallback(() => {
    try {
      localStorage.removeItem(localStorageKey);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }, [localStorageKey]);

  /**
   * Load content from localStorage.
   * 
   * Retrieves and parses stored draft content with timestamp.
   * Returns null if no draft exists or parsing fails.
   * 
   * @returns Draft content with lastModified timestamp, or null
   */
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

  /**
   * Handle content change with auto-save.
   * 
   * Saves to localStorage immediately, then schedules a debounced backend save.
   * Uses adaptive debounce delay based on time since last save:
   * - 300ms if idle for more than 5 seconds (user paused editing)
   * - 500ms if actively editing (frequent changes)
   * 
   * @param content - New content to save
   */
  const handleChange = useCallback(
    (content: string) => {
      if (!enabled || !documentId) return;

      // Save to localStorage immediately for offline support
      saveToLocalStorage(content);

      // Clear any pending save
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Calculate adaptive debounce delay
      const timeSinceLastSave = Date.now() - lastSaveRef.current;
      const debounceDelay = timeSinceLastSave > 5000 ? 300 : 500;

      // Schedule backend save with debounce
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          await onSave(content);
          // Clear localStorage draft after successful save
          clearLocalDraft();
          lastSaveRef.current = Date.now();
        } catch (error) {
          console.error('Failed to save:', error);
          // Don't clear localStorage on error - keep draft for recovery
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

  // Cleanup on unmount - cancel any pending saves
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
