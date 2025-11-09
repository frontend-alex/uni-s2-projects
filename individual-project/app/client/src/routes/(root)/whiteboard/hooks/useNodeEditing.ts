/**
 * Node Editing Hook
 * 
 * Shared hook for handling node label and name editing functionality.
 * Reduces code duplication across RectangleNode, CircleNode, and DiamondNode.
 * 
 * @module whiteboard/hooks/useNodeEditing
 */

import { useState, useEffect, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { RectangleNodeData, CircleNodeData, DiamondNodeData } from '../components/nodes';

/**
 * Configuration for node editing hook
 */
interface UseNodeEditingConfig {
  /** Node ID */
  nodeId: string;
  /** Node data */
  nodeData: RectangleNodeData | CircleNodeData | DiamondNodeData;
  /** Callback when node data changes (triggers save) */
  onDataChange?: () => void;
}

/**
 * Return type for useNodeEditing hook
 */
interface UseNodeEditingReturn {
  /** Current label value */
  label: string;
  /** Current name value */
  name: string;
  /** Whether label is being edited */
  isEditing: boolean;
  /** Whether name is being edited */
  isEditingName: boolean;
  /** Set label value */
  setLabel: (value: string) => void;
  /** Set name value */
  setName: (value: string) => void;
  /** Set editing state for label */
  setIsEditing: (value: boolean) => void;
  /** Set editing state for name */
  setIsEditingName: (value: boolean) => void;
  /** Handle label blur event */
  handleLabelBlur: () => void;
  /** Handle name blur event */
  handleNameBlur: () => void;
  /** Handle label key down event */
  handleLabelKeyDown: (e: React.KeyboardEvent) => void;
  /** Handle name key down event */
  handleNameKeyDown: (e: React.KeyboardEvent) => void;
  /** Handle double click to start editing label */
  handleDoubleClick: () => void;
}

/**
 * Hook for managing node label and name editing state and handlers.
 * 
 * Provides unified editing functionality for nodes with labels and names.
 * Handles synchronization with node data, keyboard shortcuts, and save triggers.
 * 
 * @param config - Configuration object
 * @returns Node editing state and handlers
 * 
 * @example
 * ```typescript
 * const {
 *   label,
 *   name,
 *   isEditing,
 *   setLabel,
 *   handleLabelBlur,
 *   handleDoubleClick,
 * } = useNodeEditing({
 *   nodeId: node.id,
 *   nodeData: node.data,
 *   onDataChange: () => save(),
 * });
 * ```
 */
export function useNodeEditing({
  nodeId,
  nodeData,
  onDataChange,
}: UseNodeEditingConfig): UseNodeEditingReturn {
  const { updateNodeData } = useReactFlow();
  
  // Initialize state from node data
  const [label, setLabel] = useState(nodeData.label ?? nodeData.name ?? '');
  const [name, setName] = useState(nodeData.name ?? nodeData.label ?? '');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  // Sync label and name with node data when it changes externally
  useEffect(() => {
    const newLabel = nodeData.label ?? nodeData.name ?? '';
    const newName = nodeData.name ?? nodeData.label ?? '';
    
    setLabel(newLabel);
    setName(newName);
  }, [nodeData.label, nodeData.name]);

  /**
   * Handle label blur - save label changes
   */
  const handleLabelBlur = useCallback(() => {
    setIsEditing(false);
    const updatedData = { ...nodeData, label };
    updateNodeData(nodeId, updatedData);
    
    // Notify parent to trigger save
    if (onDataChange) {
      setTimeout(() => onDataChange(), 0);
    }
  }, [nodeId, nodeData, label, updateNodeData, onDataChange]);

  /**
   * Handle name blur - save name changes
   */
  const handleNameBlur = useCallback(() => {
    setIsEditingName(false);
    const updatedData = { ...nodeData, name };
    updateNodeData(nodeId, updatedData);
    
    // Notify parent to trigger save
    if (onDataChange) {
      setTimeout(() => onDataChange(), 0);
    }
  }, [nodeId, nodeData, name, updateNodeData, onDataChange]);

  /**
   * Handle label key down - Enter to save, Escape to cancel
   */
  const handleLabelKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        setIsEditing(false);
        const updatedData = { ...nodeData, label };
        updateNodeData(nodeId, updatedData);
        
        // Notify parent to trigger save
        if (onDataChange) {
          setTimeout(() => onDataChange(), 0);
        }
      } else if (e.key === 'Escape') {
        setIsEditing(false);
        // Reset to original value
        setLabel(nodeData.label ?? nodeData.name ?? '');
      }
    },
    [nodeId, nodeData, label, updateNodeData, onDataChange]
  );

  /**
   * Handle name key down - Enter to save, Escape to cancel
   */
  const handleNameKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        setIsEditingName(false);
        const updatedData = { ...nodeData, name };
        updateNodeData(nodeId, updatedData);
        
        // Notify parent to trigger save
        if (onDataChange) {
          setTimeout(() => onDataChange(), 0);
        }
      } else if (e.key === 'Escape') {
        setIsEditingName(false);
        // Reset to original value
        setName(nodeData.name ?? nodeData.label ?? '');
      }
    },
    [nodeId, nodeData, name, updateNodeData, onDataChange]
  );

  /**
   * Handle double click - start editing label
   */
  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  return {
    label,
    name,
    isEditing,
    isEditingName,
    setLabel,
    setName,
    setIsEditing,
    setIsEditingName,
    handleLabelBlur,
    handleNameBlur,
    handleLabelKeyDown,
    handleNameKeyDown,
    handleDoubleClick,
  };
}

