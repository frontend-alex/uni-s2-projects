/**
 * Whiteboard Storage Hook
 * 
 * Provides storage functionality for whiteboard data, including:
 * - Auto-saving to backend with debouncing
 * - Loading from localStorage as fallback
 * - Clearing local drafts
 * 
 * Wraps the generic useAutoSave hook with whiteboard-specific data conversion.
 * 
 * @module whiteboard/hooks/useWhiteboardStorage
 */

import { useCallback, useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { useUpdateDocument } from '@/hooks/document/use-document';
import { useAutoSave } from '@/hooks/useAutoSave';

/**
 * Whiteboard data structure stored in localStorage
 */
interface WhiteboardData {
  nodes: Node[];
  edges: Edge[];
  lastModified: number;
}

/**
 * Props for useWhiteboardStorage hook
 */
interface UseWhiteboardStorageProps {
  /** Document ID for saving/loading */
  documentId: number;
  /** Whether storage is enabled (default: true) */
  enabled?: boolean;
}

/**
 * Return type for useWhiteboardStorage hook
 */
interface UseWhiteboardStorageReturn {
  /** Save nodes and edges (triggers auto-save) */
  save: (nodes: Node[], edges: Edge[]) => void;
  /** Load data from localStorage */
  loadFromLocalStorage: () => WhiteboardData | null;
  /** Clear localStorage for this whiteboard */
  clearLocalStorage: () => void;
}

/**
 * Hook for managing whiteboard storage operations.
 * 
 * Handles saving whiteboard state (nodes and edges) to backend with auto-save,
 * and loading from localStorage as a fallback.
 * 
 * Performance considerations:
 * - Uses debounced saves to prevent excessive API calls
 * - Immediately saves to localStorage for offline support
 * - Clears localStorage after successful backend save
 * 
 * @param props - Hook configuration
 * @returns Storage functions
 * 
 * @example
 * ```typescript
 * const { save, loadFromLocalStorage } = useWhiteboardStorage({
 *   documentId: 123,
 *   enabled: true,
 * });
 * 
 * // Save whiteboard state
 * save(nodes, edges);
 * 
 * // Load from localStorage
 * const localData = loadFromLocalStorage();
 * if (localData) {
 *   setNodes(localData.nodes);
 *   setEdges(localData.edges);
 * }
 * ```
 */
export function useWhiteboardStorage({
  documentId,
  enabled = true,
}: UseWhiteboardStorageProps): UseWhiteboardStorageReturn {
  const updateDocumentMutation = useUpdateDocument(documentId);
  const { mutateAsync: updateDocument } = updateDocumentMutation;
  
  // Memoize localStorage key to avoid recreation
  const localStorageKey = useMemo(
    () => `whiteboard-${documentId}`,
    [documentId]
  );

  // Use generic auto-save hook with whiteboard-specific conversion
  const { handleChange, loadFromLocalStorage: loadLocalData } = useAutoSave({
    documentId,
    enabled: enabled && !!documentId,
    onSave: async (content: string) => {
      await updateDocument({ content });
    },
    localStorageKey,
  });

  /**
   * Save nodes and edges to storage.
   * 
   * Converts nodes/edges to JSON string and triggers auto-save.
   * Auto-save handles debouncing and localStorage caching.
   * 
   * @param nodes - Array of nodes to save
   * @param edges - Array of edges to save
   */
  const save = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      if (!enabled || !documentId) return;
      
      // Convert to JSON string for storage
      const content = JSON.stringify({ nodes, edges });
      handleChange(content);
    },
    [enabled, documentId, handleChange]
  );

  /**
   * Load whiteboard data from localStorage.
   * 
   * Parses stored JSON and validates structure.
   * Returns null if data is invalid or doesn't exist.
   * 
   * @returns Whiteboard data with nodes, edges, and lastModified timestamp, or null
   */
  const loadFromLocalStorage = useCallback((): WhiteboardData | null => {
    const localData = loadLocalData();
    if (!localData) return null;

    try {
      const parsed = JSON.parse(localData.content);
      
      // Validate structure
      if (parsed.nodes && Array.isArray(parsed.nodes) && parsed.edges && Array.isArray(parsed.edges)) {
        return {
          nodes: parsed.nodes,
          edges: parsed.edges,
          lastModified: localData.lastModified,
        };
      }
    } catch (error) {
      console.warn('Failed to parse whiteboard data from localStorage:', error);
    }

    return null;
  }, [loadLocalData]);

  /**
   * Clear localStorage for this whiteboard.
   * 
   * Removes the stored draft data. Useful for cleanup or reset operations.
   */
  const clearLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem(localStorageKey);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }, [localStorageKey]);

  return {
    save,
    loadFromLocalStorage,
    clearLocalStorage,
  };
}
