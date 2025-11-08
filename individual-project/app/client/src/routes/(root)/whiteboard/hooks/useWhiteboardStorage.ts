import { useCallback } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { useUpdateDocument } from '@/hooks/document/use-document';
import { useAutoSave } from '@/hooks/useAutoSave';

interface WhiteboardData {
  nodes: Node[];
  edges: Edge[];
  lastModified: number;
}

interface UseWhiteboardStorageProps {
  documentId: number;
  enabled?: boolean;
}

export function useWhiteboardStorage({
  documentId,
  enabled = true,
}: UseWhiteboardStorageProps) {
  const updateDocumentMutation = useUpdateDocument(documentId);
  const { mutateAsync: updateDocument } = updateDocumentMutation;
  
  const localStorageKey = `whiteboard-${documentId}`;

  const { handleChange, loadFromLocalStorage: loadLocalData } = useAutoSave({
    documentId,
    enabled: enabled && !!documentId,
    onSave: async (content: string) => {
      await updateDocument({ content });
    },
    localStorageKey,
  });

  const save = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      if (!enabled || !documentId) return;
      const content = JSON.stringify({ nodes, edges });
      handleChange(content);
    },
    [enabled, documentId, handleChange]
  );

  const loadFromLocalStorage = useCallback((): WhiteboardData | null => {
    const localData = loadLocalData();
    if (!localData) return null;

    try {
      const parsed = JSON.parse(localData.content);
      if (parsed.nodes && parsed.edges) {
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

  // Clear localStorage (wrapper for consistency)
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

