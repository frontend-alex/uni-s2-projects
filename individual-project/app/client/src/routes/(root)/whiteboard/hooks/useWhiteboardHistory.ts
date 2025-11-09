/**
 * Whiteboard History Management Hook
 * 
 * Manages undo/redo history for whiteboard operations.
 * Optimized for performance with configurable history size limits.
 * 
 * @module whiteboard/hooks/useWhiteboardHistory
 */

import { useCallback, useRef, useState } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { WHITEBOARD_CONFIG } from '../config/whiteboard-config';

/**
 * History state entry
 */
interface HistoryEntry {
  nodes: Node[];
  edges: Edge[];
}

/**
 * Return type for useWhiteboardHistory hook
 */
interface UseWhiteboardHistoryReturn {
  /** Save current state to history */
  saveToHistory: (nodes: Node[], edges: Edge[]) => void;
  /** Undo last action */
  undo: () => void;
  /** Redo last undone action */
  redo: () => void;
  /** Check if undo is available */
  canUndo: boolean;
  /** Check if redo is available */
  canRedo: boolean;
}

/**
 * Hook for managing whiteboard undo/redo history.
 * 
 * Maintains a history stack with configurable size limits to prevent memory issues.
 * Uses refs to avoid unnecessary re-renders while maintaining history state.
 * 
 * @returns History management functions and state
 * 
 * @example
 * ```typescript
 * const { saveToHistory, undo, redo, canUndo, canRedo } = useWhiteboardHistory();
 * 
 * // Save state after modification
 * saveToHistory(nodes, edges);
 * 
 * // Undo/redo
 * if (canUndo) undo();
 * if (canRedo) redo();
 * ```
 */
export function useWhiteboardHistory(): UseWhiteboardHistoryReturn {
  // History stack stored in ref to avoid re-renders
  const historyRef = useRef<HistoryEntry[]>([]);
  const historyIndexRef = useRef(-1);
  
  // Force re-render when history changes (for canUndo/canRedo)
  const [, setHistoryUpdate] = useState(0);

  /**
   * Save current state to history.
   * 
   * Creates a deep clone of nodes and edges to avoid reference issues.
   * Maintains history size limit to prevent memory leaks.
   * 
   * @param nodes - Current nodes state
   * @param edges - Current edges state
   */
  const saveToHistory = useCallback((nodes: Node[], edges: Edge[]) => {
    // Create new history entry with deep clone
    const newEntry: HistoryEntry = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    
    // Remove any future history if we're not at the end
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(newEntry);
    
    // Limit history size to prevent memory issues
    while (newHistory.length > WHITEBOARD_CONFIG.history.maxHistorySize) {
      newHistory.shift();
      historyIndexRef.current -= 1;
    }
    
    // Update history index
    historyIndexRef.current = newHistory.length - 1;
    historyRef.current = newHistory;
    
    // Trigger re-render to update canUndo/canRedo
    setHistoryUpdate((prev) => prev + 1);
  }, []);

  /**
   * Undo last action.
   * 
   * Moves back in history and returns previous state.
   * Does not create a new history entry (navigation, not action).
   * 
   * @returns Previous state if available, null otherwise
   */
  const undo = useCallback((): HistoryEntry | null => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const prevState = historyRef.current[historyIndexRef.current];
      
      if (prevState) {
        setHistoryUpdate((prev) => prev + 1);
        return prevState;
      }
    }
    
    return null;
  }, []);

  /**
   * Redo last undone action.
   * 
   * Moves forward in history and returns next state.
   * Does not create a new history entry (navigation, not action).
   * 
   * @returns Next state if available, null otherwise
   */
  const redo = useCallback((): HistoryEntry | null => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const nextState = historyRef.current[historyIndexRef.current];
      
      if (nextState) {
        setHistoryUpdate((prev) => prev + 1);
        return nextState;
      }
    }
    
    return null;
  }, []);

  // Compute canUndo/canRedo based on current history index
  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  return {
    saveToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}

