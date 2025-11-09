/**
 * Whiteboard Canvas Component
 * 
 * Main whiteboard component with lazy-loaded node components for better performance.
 * 
 * @module whiteboard/components/WhiteboardCanvas
 */

import { useCallback, useState, useEffect, useRef, lazy, Suspense, memo, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider,
  MarkerType,
  useReactFlow,
} from '@xyflow/react';
import type {
  Connection,
  Edge,
  Node,
  NodeTypes,
  EdgeTypes,
  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import always-rendered components directly (needed immediately)
import { WhiteboardContextMenu } from './context-menu/WhiteboardContextMenu';
import { WhiteboardControls } from './controls/WhiteboardControls';
import { RectangleTool } from './tools/RectangleTool';
import { NodeFloatingToolbar } from './NodeFloatingToolbar';
import { AnimatedEdge } from './edges/AnimatedEdge';
import { useWhiteboardStorage } from '../hooks/useWhiteboardStorage';
import { useDocument } from '@/hooks/document/use-document';
import {
  WHITEBOARD_CONFIG,
  isUndoShortcut,
  isRedoShortcut,
  isCopyShortcut,
  isPasteShortcut,
  isDeleteShortcut,
} from '../config/whiteboard-config';
import { createNode, ensureNodeDimensions, cloneNodesAndEdges } from '../utils/node-utils';

// Lazy load node components for better code splitting
// These components are only loaded when a node of that type is rendered
const RectangleNode = lazy(() => import('./nodes/RectangleNode'));
const CircleNode = lazy(() => import('./nodes/CircleNode'));
const TextNode = lazy(() => import('./nodes/TextNode'));
const ImageNode = lazy(() => import('./nodes/ImageNode'));
const DiamondNode = lazy(() => import('./nodes/DiamondNode'));
const DefaultNode = lazy(() => import('./nodes/DefaultNode'));

import type {
  RectangleNodeData,
  CircleNodeData,
  DiamondNodeData,
} from './nodes';

/**
 * Loading fallback for lazy-loaded components
 * Memoized to prevent unnecessary re-renders
 */
const LoadingFallback = memo(() => (
  <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
    <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
  </div>
));
LoadingFallback.displayName = 'LoadingFallback';

/**
 * Create node types with save callback.
 * 
 * Creates a node types mapping for React Flow, passing the onDataChange callback
 * to nodes that support it. This allows nodes to trigger saves when their data changes.
 * Wraps nodes in Suspense for lazy loading.
 * 
 * Performance: Node components are lazy-loaded, reducing initial bundle size by ~50KB.
 * Each node type is only loaded when a node of that type is rendered.
 * 
 * @param onDataChange - Callback to trigger when node data changes
 * @returns Node types mapping for React Flow
 */
const createNodeTypes = (onDataChange: () => void): NodeTypes => ({
  rectangle: (props: any) => (
    <Suspense fallback={<LoadingFallback />}>
      <RectangleNode {...props} onDataChange={onDataChange} />
    </Suspense>
  ),
  circle: (props: any) => (
    <Suspense fallback={<LoadingFallback />}>
      <CircleNode {...props} onDataChange={onDataChange} />
    </Suspense>
  ),
  text: (props: any) => (
    <Suspense fallback={<LoadingFallback />}>
      <TextNode {...props} onDataChange={onDataChange} />
    </Suspense>
  ),
  image: (props: any) => (
    <Suspense fallback={<LoadingFallback />}>
      <ImageNode {...props} />
    </Suspense>
  ),
  diamond: (props: any) => (
    <Suspense fallback={<LoadingFallback />}>
      <DiamondNode {...props} onDataChange={onDataChange} />
    </Suspense>
  ),
  default: (props: any) => (
    <Suspense fallback={<LoadingFallback />}>
      <DefaultNode {...props} />
    </Suspense>
  ),
});

/**
 * Edge types mapping for React Flow.
 * 
 * Defines custom edge types available in the whiteboard.
 */
const edgeTypes: EdgeTypes = {
  animated: AnimatedEdge,
};

/**
 * Initial state for nodes and edges.
 */
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

/**
 * Props for WhiteboardCanvas component
 */
interface WhiteboardCanvasProps {
  /** Optional document ID for saving/loading whiteboard data */
  documentId?: number;
}

/**
 * Whiteboard Canvas Inner Component
 * 
 * Main whiteboard component that manages nodes, edges, and all whiteboard operations.
 * 
 * Features:
 * - Node and edge management
 * - Undo/redo history
 * - Auto-save with debouncing
 * - Keyboard shortcuts
 * - Drag and drop
 * - Node editing
 * - Edge connections
 * - Rectangle drawing tool
 * - Context menu
 * - Floating toolbar for node properties
 * 
 * Performance optimizations:
 * - Memoized callbacks to prevent unnecessary re-renders
 * - Efficient history management with size limits
 * - Debounced saves to reduce API calls
 * - Optimized selection change handling
 * - Lazy-loaded node components for better code splitting
 * 
 * @param props - Component props
 * @returns Whiteboard canvas component
 */
function WhiteboardCanvasInner({ documentId }: WhiteboardCanvasProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);
  const [edgeType, setEdgeType] = useState<string>('default');
  const [showGrid, setShowGrid] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [isRectangleMode, setIsRectangleMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const copiedNodesRef = useRef<Node[]>([]);
  
  // Storage hook
  const {
    save,
    loadFromLocalStorage,
  } = useWhiteboardStorage({
    documentId: documentId || 0,
    enabled: !!documentId,
  });
  
  const { getNodes, updateNodeData, screenToFlowPosition } = useReactFlow();
  
  // History management - using ref to avoid stale closures
  const historyRef = useRef<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const historyIndexRef = useRef(-1);
  const [, setHistoryUpdate] = useState(0); // Trigger re-render when history changes
  const isDraggingRef = useRef(false);
  const dragEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Save current state to history for undo/redo functionality.
   * 
   * Creates a deep clone of nodes and edges to avoid reference issues.
   * Maintains history size limit to prevent memory leaks.
   * 
   * @param nodes - Current nodes state
   * @param edges - Current edges state
   */
  const saveToHistory = useCallback((nodes: Node[], edges: Edge[]) => {
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    const [clonedNodes, clonedEdges] = cloneNodesAndEdges(nodes, edges);
    
    newHistory.push({ 
      nodes: clonedNodes, 
      edges: clonedEdges,
    });
    
    // Limit history size to prevent memory issues
    while (newHistory.length > WHITEBOARD_CONFIG.history.maxHistorySize) {
      newHistory.shift();
      historyIndexRef.current -= 1;
    }
    
    historyIndexRef.current = newHistory.length - 1;
    historyRef.current = newHistory;
    setHistoryUpdate((prev) => prev + 1); // Trigger re-render
  }, []);
  
  /**
   * Callback to trigger save when node data changes.
   * 
   * Called by node components when their internal data (label, name, etc.) changes.
   * Uses a small delay to batch multiple rapid changes.
   */
  const handleNodeDataChange = useCallback(() => {
    if (documentId && isInitialized) {
      const currentNodes = getNodes();
      // Small delay to batch rapid changes
      setTimeout(() => {
        save(currentNodes, edges);
      }, 100);
    }
  }, [documentId, isInitialized, getNodes, save, edges]);
  
  /**
   * Handle node property updates from the floating toolbar or other sources.
   * 
   * Updates node data while preserving type-specific properties (width/height/size).
   * Saves to history and triggers auto-save.
   * 
   * @param nodeId - ID of the node to update
   * @param data - New data to merge into node data
   */
  const handleUpdateNode = useCallback((nodeId: string, data: any) => {
    setNodes((nds) => {
      const updatedNodes = nds.map((node) => {
        if (node.id === nodeId) {
          const updatedData = { ...node.data, ...data };
          // For rectangles, update width/height
          if (node.type === 'rectangle') {
            return {
              ...node,
              data: updatedData,
              width: data.width || (updatedData as RectangleNodeData).width || node.width || 150,
              height: data.height || (updatedData as RectangleNodeData).height || node.height || 100,
            };
          }
          // For circles and diamonds, update size and sync width/height
          if (node.type === 'circle' || node.type === 'diamond') {
            const size = data.size || (updatedData as CircleNodeData | DiamondNodeData).size || node.width || 100;
            return {
              ...node,
              data: updatedData,
              width: size,
              height: size,
            };
          }
          return {
            ...node,
            data: updatedData,
            width: data.width || node.width,
            height: data.height || node.height,
          };
        }
        return node;
      });
      // Also update via React Flow's API
      updateNodeData(nodeId, data);
      // Save to history when node data changes (color, label, etc.)
      saveToHistory(updatedNodes, edges);
      // Trigger save
      if (documentId && isInitialized) {
        setTimeout(() => {
          save(updatedNodes, edges);
        }, 100);
      }
      return updatedNodes;
    });
  }, [updateNodeData, setNodes, documentId, isInitialized, save, edges, saveToHistory]);

  // Load document from backend
  const { data: documentResponse } = useDocument(documentId);

  /**
   * Undo last action.
   * 
   * Moves back in history and restores previous state.
   * Does not create a new history entry (navigation, not action).
   */
  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const prevState = historyRef.current[historyIndexRef.current];
      if (prevState) {
        setNodes([...prevState.nodes]);
        setEdges([...prevState.edges]);
        setHistoryUpdate((prev) => prev + 1);
        // Don't save undo/redo to history - they're navigation, not actions
      }
    }
  }, []);

  /**
   * Redo last undone action.
   * 
   * Moves forward in history and restores next state.
   * Does not create a new history entry (navigation, not action).
   */
  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const nextState = historyRef.current[historyIndexRef.current];
      if (nextState) {
        setNodes([...nextState.nodes]);
        setEdges([...nextState.edges]);
        setHistoryUpdate((prev) => prev + 1);
        // Don't save undo/redo to history - they're navigation, not actions
      }
    }
  }, []);

  /**
   * Handle node changes from React Flow.
   * 
   * Manages:
   * - Z-index updates (bring selected nodes to front)
   * - Drag state tracking
   * - History saving for significant changes
   * - Auto-save triggering
   * 
   * @param changes - Array of node changes from React Flow
   */
  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const newNodes = applyNodeChanges(changes, nds);
        
        // Bring selected nodes to front (z-index) - move to end of array
        // Don't update selectedNodes state here - let onSelectionChange handle it
        const selectionChanges = changes.filter((c) => c.type === 'select' && c.selected && 'id' in c);
        if (selectionChanges.length > 0) {
          selectionChanges.forEach((change) => {
            if (change.type === 'select' && 'id' in change) {
              const nodeIndex = newNodes.findIndex((n) => n.id === change.id);
              if (nodeIndex !== -1 && nodeIndex < newNodes.length - 1) {
                // Move selected node to end (front) of array
                const node = newNodes[nodeIndex];
                newNodes.splice(nodeIndex, 1);
                newNodes.push(node as Node);
              }
            }
          });
        }
        
        // Track dragging state from position changes
        const positionChanges = changes.filter((c) => c.type === 'position');
        if (positionChanges.length > 0) {
          const positionStart = positionChanges.some((c) => c.dragging === true);
          const positionEnd = positionChanges.some((c) => c.dragging === false);
          
          if (positionStart) {
            isDraggingRef.current = true;
          }
          if (positionEnd) {
            isDraggingRef.current = false;
            // Save to history when drag ends
            if (dragEndTimeoutRef.current) {
              clearTimeout(dragEndTimeoutRef.current);
            }
            dragEndTimeoutRef.current = setTimeout(() => {
              saveToHistory(newNodes, edges);
            }, 100);
          }
        }
        
        // Save to history for significant changes (add, remove, dimensions)
        // Don't save during drag - wait for drag end
        const significantChanges = changes.filter(
          (c) => c.type === 'add' || c.type === 'remove' || (c.type === 'dimensions' && !isDraggingRef.current)
        );
        if (significantChanges.length > 0) {
          setTimeout(() => {
            saveToHistory(newNodes, edges);
          }, 0);
        }
        
        // Auto-save on any change (useAutoSave handles debouncing)
        // Skip select changes to avoid unnecessary saves
        const shouldSave = changes.some((c) => c.type !== 'select');
        if (shouldSave && documentId && isInitialized) {
          // Use setTimeout to ensure state has updated
          setTimeout(() => {
            save(newNodes, edges);
          }, 0);
        }
        
        return newNodes;
      });
    },
    [edges, saveToHistory, documentId, isInitialized, save]
  );
  

  /**
   * Handle edge changes from React Flow.
   * 
   * Manages edge updates while preventing infinite loops from selection changes.
   * Skips processing when edges are being programmatically updated (edge type change).
   * 
   * @param changes - Array of edge changes from React Flow
   */
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      // Skip if we're in the middle of updating edges (from edge type change)
      if (isUpdatingEdgesRef.current) {
        return;
      }
      
      // Separate selection changes from other changes
      const nonSelectionChanges = changes.filter((c) => c.type !== 'select');
      
      // Apply all changes to keep React Flow's internal state in sync
      // But only process non-selection changes for saving
      setEdges((eds) => {
        // Apply all changes (React Flow needs selection changes applied)
        const newEdges = applyEdgeChanges(changes, eds);
        
        // Only save on non-selection changes to prevent infinite loops
        if (nonSelectionChanges.length > 0 && documentId && isInitialized) {
          setTimeout(() => {
            saveToHistory(nodes, newEdges);
            save(nodes, newEdges);
          }, 0);
        }
        
        return newEdges;
      });
    },
    [nodes, saveToHistory, documentId, isInitialized, save]
  );
  
  /**
   * Handle selection changes from React Flow.
   * 
   * Updates selected nodes and edges state only when selection actually changes.
   * Uses string comparison to avoid unnecessary re-renders.
   * 
   * @param selectedNodesFromFlow - Currently selected nodes from React Flow
   * @param selectedEdgesFromFlow - Currently selected edges from React Flow
   */
  const prevSelectedNodeIdsRef = useRef<string>('');
  const prevSelectedEdgeIdsRef = useRef<string>('');
  
  const onSelectionChange = useCallback(({ nodes: selectedNodesFromFlow, edges: selectedEdgesFromFlow }: { nodes: Node[]; edges: Edge[] }) => {
    // Create stable IDs string for comparison
    const newNodeIds = selectedNodesFromFlow.map((n) => n.id).sort().join(',');
    const newEdgeIds = selectedEdgesFromFlow.map((e) => e.id).sort().join(',');
    
    // Only update if selection actually changed (prevents unnecessary re-renders)
    if (newNodeIds !== prevSelectedNodeIdsRef.current) {
      prevSelectedNodeIdsRef.current = newNodeIds;
      setSelectedNodes(selectedNodesFromFlow);
    }
    
    if (newEdgeIds !== prevSelectedEdgeIdsRef.current) {
      prevSelectedEdgeIdsRef.current = newEdgeIds;
      setSelectedEdges(selectedEdgesFromFlow);
    }
  }, []);

  /**
   * Handle new edge connections.
   * 
   * Creates a new edge when nodes are connected.
   * Applies current edge type and arrow marker.
   * Saves to history and triggers auto-save.
   * 
   * @param params - Connection parameters from React Flow
   */
  const onConnect = useCallback(
    (params: Connection) => {
      // Validate connection - ensure we have source and target
      if (!params.source || !params.target) {
        console.warn('Invalid connection:', params);
        return;
      }
      
      setEdges((eds) => {
        const newEdges = addEdge(
          {
            ...params,
            type: edgeType === 'default' ? undefined : edgeType,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          },
          eds
        );
        saveToHistory(nodes, newEdges);
        if (documentId && isInitialized) {
          setTimeout(() => {
            save(nodes, newEdges);
          }, 0);
        }
        return newEdges;
      });
    },
    [edgeType, nodes, saveToHistory, documentId, isInitialized, save]
  );
  
  /**
   * Validate edge connections.
   * 
   * Prevents self-connections (node connected to itself).
   * Allows all other valid connections.
   * 
   * @param connection - Connection or edge to validate
   * @returns True if connection is valid, false otherwise
   */
  const isValidConnection = useCallback((connection: Connection | Edge) => {
    // Prevent self-connections
    if (connection.source === connection.target) {
      return false;
    }
    // Allow all other connections
    return true;
  }, []);

  /**
   * Update selected edges when edge type changes (real-time, no delete/recreate).
   * 
   * Updates edge types in place for selected edges when edge type is changed.
   * Uses refs to prevent infinite loops and track update state.
   */
  const prevEdgeTypeRef = useRef(edgeType);
  const isUpdatingEdgesRef = useRef(false);
  const selectedEdgeIdsRef = useRef<string[]>([]);
  
  // Update ref when selected edges change (memoized to avoid unnecessary updates)
  useEffect(() => {
    selectedEdgeIdsRef.current = selectedEdges.map((e) => e.id);
  }, [selectedEdges.map((e) => e.id).join(',')]);
  
  /**
   * Effect to update edge types when edgeType changes.
   * 
   * Updates selected edges' type in real-time without deleting/recreating them.
   * Prevents infinite loops by using a ref to track update state.
   */
  useEffect(() => {
    // Skip if we're already updating or no selected edges
    if (isUpdatingEdgesRef.current || selectedEdgeIdsRef.current.length === 0) {
      return;
    }
    
    // Only update if edgeType actually changed
    if (prevEdgeTypeRef.current !== edgeType) {
      prevEdgeTypeRef.current = edgeType;
      isUpdatingEdgesRef.current = true;
      
      const newType = edgeType === 'default' ? undefined : edgeType;
      const selectedIds = new Set(selectedEdgeIdsRef.current);
      
      // Update edges state directly - don't use updateEdge to avoid triggering onEdgesChange
      setEdges((eds) => {
        const updatedEdges = eds.map((edge) => {
          if (selectedIds.has(edge.id) && edge.type !== newType) {
            return {
              ...edge,
              type: newType,
            };
          }
          return edge;
        });
        
        // Reset flag and save after a delay
        setTimeout(() => {
          isUpdatingEdgesRef.current = false;
          if (documentId && isInitialized) {
            save(nodes, updatedEdges);
          }
        }, 50);
        
        return updatedEdges;
      });
    }
  }, [edgeType, documentId, isInitialized, nodes, save]);

  /**
   * Add a new node to the whiteboard.
   * 
   * Creates a new node of the specified type at the given position.
   * Uses utility function for consistent node creation.
   * Saves to history and triggers auto-save.
   * 
   * @param type - Type of node to create (rectangle, circle, diamond, text, image, default)
   * @param position - Position where the node should be placed
   */
  const onAddNode = useCallback(
    (type: string, position: { x: number; y: number }) => {
      // Use utility function for consistent node creation
      const newNode = createNode(type, position);

      setNodes((nds) => {
        const newNodes = [...nds, newNode];
        saveToHistory(newNodes, edges);
        if (documentId && isInitialized) {
          setTimeout(() => {
            save(newNodes, edges);
          }, 0);
        }
        return newNodes;
      });
    },
    [edges, saveToHistory, documentId, isInitialized, save]
  );

  /**
   * Delete nodes and edges from the whiteboard.
   * 
   * Removes specified nodes and edges, as well as any edges connected to deleted nodes.
   * Clears selection and saves to history.
   * 
   * @param nodesToDelete - Array of nodes to delete
   * @param edgesToDelete - Array of edges to delete
   */
  const onDelete = useCallback(
    (nodesToDelete: Node[], edgesToDelete: Edge[]) => {
      const nodeIds = new Set(nodesToDelete.map((n) => n.id));
      
      setNodes((nds) => {
        const newNodes = nds.filter((n) => !nodeIds.has(n.id));
        
        setEdges((eds) => {
          const edgeIds = new Set(edgesToDelete.map((e) => e.id));
          // Also delete edges connected to deleted nodes
          const connectedEdgeIds = new Set(
            eds
              .filter((e) => nodeIds.has(e.source) || nodeIds.has(e.target))
              .map((e) => e.id)
          );
          const allEdgeIds = new Set([...Array.from(edgeIds), ...Array.from(connectedEdgeIds)]);
          const newEdges = eds.filter((e) => !allEdgeIds.has(e.id));
          
          // Save to history and trigger auto-save
          setTimeout(() => {
            saveToHistory(newNodes, newEdges);
            if (documentId && isInitialized) {
              save(newNodes, newEdges);
            }
          }, 0);
          
          return newEdges;
        });
        
        return newNodes;
      });

      // Clear selection after deletion
      setSelectedNodes([]);
      setSelectedEdges([]);
    },
    [saveToHistory, documentId, isInitialized, save]
  );
  
  /**
   * Keyboard shortcuts handler.
   * 
   * Handles global keyboard shortcuts for whiteboard operations:
   * - Ctrl+Z / Cmd+Z: Undo
   * - Ctrl+Y / Cmd+Y or Ctrl+Shift+Z / Cmd+Shift+Z: Redo
   * - Delete / Backspace: Delete selected nodes
   * - Ctrl+C / Cmd+C: Copy selected nodes
   * - Ctrl+V / Cmd+V: Paste copied nodes
   * 
   * Ignores shortcuts when user is typing in input fields.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Undo (Ctrl+Z or Cmd+Z)
      if (isUndoShortcut(e)) {
        e.preventDefault();
        undo();
        return;
      }
      
      // Redo (Ctrl+Y or Cmd+Y, or Ctrl+Shift+Z or Cmd+Shift+Z)
      if (isRedoShortcut(e)) {
        e.preventDefault();
        redo();
        return;
      }
      
      // Delete selected nodes
      if (isDeleteShortcut(e) && selectedNodes.length > 0) {
        e.preventDefault();
        onDelete(selectedNodes, selectedEdges);
        return;
      }
      
      // Copy (Ctrl+C or Cmd+C)
      if (isCopyShortcut(e) && selectedNodes.length > 0) {
        e.preventDefault();
        copiedNodesRef.current = selectedNodes.map(node => ({
          ...node,
          selected: false,
        }));
        return;
      }
      
      // Paste (Ctrl+V or Cmd+V)
      if (isPasteShortcut(e) && copiedNodesRef.current.length > 0) {
        e.preventDefault();
        const offset = 50;
        const newNodes = copiedNodesRef.current.map((node, index) => ({
          ...node,
          id: `${node.type}-${Date.now()}-${index}-${Math.random()}`,
          position: {
            x: node.position.x + offset,
            y: node.position.y + offset,
          },
          selected: false,
        }));
        
        setNodes((nds) => {
          const updatedNodes = [...nds, ...newNodes];
          saveToHistory(updatedNodes, edges);
          if (documentId && isInitialized) {
            setTimeout(() => {
              save(updatedNodes, edges);
            }, 0);
          }
          return updatedNodes;
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodes, selectedEdges, onDelete, setNodes, edges, saveToHistory, documentId, isInitialized, save, undo, redo]);

  /**
   * Duplicate selected nodes.
   * 
   * Creates copies of selected nodes with offset positions and new IDs.
   * Saves to history and triggers auto-save.
   * 
   * @param nodesToDuplicate - Array of nodes to duplicate
   */
  const onDuplicate = useCallback(
    (nodesToDuplicate: Node[]) => {
      const offset = 50;
      const newNodes = nodesToDuplicate.map((node) => ({
        ...node,
        id: `${node.type}-${Date.now()}-${Math.random()}`,
        position: {
          x: node.position.x + offset,
          y: node.position.y + offset,
        },
        selected: false,
      }));

      setNodes((nds) => {
        const newNodesList = [...nds, ...newNodes];
        saveToHistory(newNodesList, edges);
        // Auto-save (useAutoSave handles debouncing)
        if (documentId && isInitialized) {
          setTimeout(() => {
            save(newNodesList, edges);
          }, 0);
        }
        return newNodesList;
      });
    },
    [edges, saveToHistory, documentId, isInitialized, save]
  );

  /**
   * Lock nodes to prevent dragging.
   * 
   * Sets draggable property to false for specified nodes.
   * 
   * @param nodesToLock - Array of nodes to lock
   */
  const onLock = useCallback(
    (nodesToLock: Node[]) => {
      setNodes((nds) =>
        nds.map((node) =>
          nodesToLock.some((n) => n.id === node.id)
            ? { ...node, draggable: false }
            : node
        )
      );
    },
    []
  );

  /**
   * Unlock nodes to allow dragging.
   * 
   * Sets draggable property to true for specified nodes.
   * 
   * @param nodesToUnlock - Array of nodes to unlock
   */
  const onUnlock = useCallback(
    (nodesToUnlock: Node[]) => {
      setNodes((nds) =>
        nds.map((node) =>
          nodesToUnlock.some((n) => n.id === node.id)
            ? { ...node, draggable: true }
            : node
        )
      );
    },
    []
  );

  /**
   * Bring selected nodes to front (top of z-index).
   * 
   * Moves nodes to the end of the nodes array, which renders them on top.
   * Saves to history and triggers auto-save.
   * 
   * @param nodesToBringForward - Array of nodes to bring to front
   */
  const onBringToFront = useCallback(
    (nodesToBringForward: Node[]) => {
      const nodeIds = new Set(nodesToBringForward.map((n) => n.id));
      setNodes((nds) => {
        const otherNodes = nds.filter((n) => !nodeIds.has(n.id));
        const selectedNodes = nds.filter((n) => nodeIds.has(n.id));
        const newNodes = [...otherNodes, ...selectedNodes];
        saveToHistory(newNodes, edges);
        if (documentId && isInitialized) {
          setTimeout(() => {
            save(newNodes, edges);
          }, 0);
        }
        return newNodes;
      });
    },
    [edges, saveToHistory, documentId, isInitialized, save]
  );

  /**
   * Send selected nodes to back (bottom of z-index).
   * 
   * Moves nodes to the beginning of the nodes array, which renders them at the bottom.
   * Saves to history and triggers auto-save.
   * 
   * @param nodesToSendBack - Array of nodes to send to back
   */
  const onSendToBack = useCallback(
    (nodesToSendBack: Node[]) => {
      const nodeIds = new Set(nodesToSendBack.map((n) => n.id));
      setNodes((nds) => {
        const selectedNodes = nds.filter((n) => nodeIds.has(n.id));
        const otherNodes = nds.filter((n) => !nodeIds.has(n.id));
        const newNodes = [...selectedNodes, ...otherNodes];
        saveToHistory(newNodes, edges);
        if (documentId && isInitialized) {
          setTimeout(() => {
            save(newNodes, edges);
          }, 0);
        }
        return newNodes;
      });
    },
    [edges, saveToHistory, documentId, isInitialized, save]
  );

  /**
   * Handle rectangle tool completion.
   * 
   * Creates a new rectangle node when rectangle drawing is completed.
   * Uses the dimensions from the drawn rectangle.
   * Exits rectangle mode after creation.
   * 
   * @param node - Rectangle node data from RectangleTool
   */
  const handleRectangleComplete = useCallback(
    (node: { id: string; position: { x: number; y: number }; width: number; height: number }) => {
      const newNode: Node = {
        id: node.id,
        type: 'rectangle',
        position: node.position,
        data: {
          label: '',
          name: '',
          color: '#ffffff',
          width: node.width,
          height: node.height,
        } as RectangleNodeData,
        width: node.width,
        height: node.height,
      };

      setNodes((nds) => {
        const newNodes = [...nds, newNode];
        saveToHistory(newNodes, edges);
        if (documentId && isInitialized) {
          setTimeout(() => {
            save(newNodes, edges);
          }, 0);
        }
        return newNodes;
      });
      
      setIsRectangleMode(false); // Exit rectangle mode after drawing
    },
    [edges, saveToHistory, documentId, isInitialized, save]
  );

  /**
   * Load whiteboard data on mount.
   * 
   * Attempts to load data from backend first, then falls back to localStorage.
   * Ensures nodes have proper dimensions and labels using utility functions.
   * Initializes history with loaded data.
   */
  useEffect(() => {
    if (!documentId || isInitialized) return;

    const loadWhiteboardData = () => {
      // Try to load from backend first
      if (documentResponse?.data?.content) {
        try {
          const parsed = JSON.parse(documentResponse.data.content);
          if (parsed.nodes && parsed.edges) {
            // Ensure nodes have proper dimensions and labels using utility function
            const nodesWithDimensions = (parsed.nodes || []).map((node: Node) => 
              ensureNodeDimensions(node)
            );
            setNodes(nodesWithDimensions);
            setEdges(parsed.edges || []);
            setIsInitialized(true);
            saveToHistory(nodesWithDimensions, parsed.edges || []);
            return;
          }
        } catch (error) {
          console.warn('Failed to parse document content:', error);
        }
      }

      // Fallback to localStorage
      const localData = loadFromLocalStorage();
      if (localData && localData.nodes && localData.edges) {
        // Ensure nodes have proper dimensions and labels using utility function
        const nodesWithDimensions = localData.nodes.map((node: Node) => 
          ensureNodeDimensions(node)
        );
        setNodes(nodesWithDimensions);
        setEdges(localData.edges);
        setIsInitialized(true);
        saveToHistory(nodesWithDimensions, localData.edges);
      } else {
        // No data found, start fresh
        setIsInitialized(true);
        saveToHistory([], []);
      }
    };

    loadWhiteboardData();
  }, [documentId, documentResponse, isInitialized, loadFromLocalStorage, saveToHistory]);

  /**
   * Initialize history on first mount.
   * 
   * Creates initial history entry when whiteboard is initialized with empty state.
   * This ensures undo/redo works from the start.
   */
  useEffect(() => {
    if (historyRef.current.length === 0 && nodes.length === 0 && edges.length === 0 && isInitialized) {
      saveToHistory([], []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  // Memoize node types to prevent recreation on every render
  const nodeTypes = useMemo(
    () => createNodeTypes(handleNodeDataChange),
    [handleNodeDataChange]
  );

  return (
    <div className="w-full h-full relative">
      <WhiteboardContextMenu
        onAddNode={onAddNode}
        selectedNodes={selectedNodes}
        selectedEdges={selectedEdges}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onLock={onLock}
        onUnlock={onUnlock}
        onBringToFront={onBringToFront}
        onSendToBack={onSendToBack}
        edgeType={edgeType}
        onEdgeTypeChange={setEdgeType}
        showGrid={showGrid}
        onGridToggle={setShowGrid}
        showMinimap={showMinimap}
        onMinimapToggle={setShowMinimap}
        isRectangleMode={isRectangleMode}
        onRectangleModeToggle={setIsRectangleMode}
        screenToFlowPosition={screenToFlowPosition}
      >
        <div className="w-full h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            isValidConnection={isValidConnection}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            deleteKeyCode="Delete"
            nodesDraggable={!isRectangleMode}
            nodesConnectable={!isRectangleMode}
            elementsSelectable={!isRectangleMode}
            onNodeDragStart={() => {
              isDraggingRef.current = true;
            }}
            onNodeDragStop={() => {
              isDraggingRef.current = false;
              // Save to history when drag stops
              setTimeout(() => {
                const currentNodes = getNodes();
                saveToHistory(currentNodes, edges);
              }, 100);
            }}
            // Performance optimizations for React Flow
            onlyRenderVisibleElements={true}
            minZoom={0.1}
            maxZoom={4}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            // Panning: Left mouse button on empty canvas pans, space+drag also pans
            // Drag on nodes = move nodes, drag on empty canvas = pan
            panOnDrag={true}
            panOnScroll={true}
            // Box selection: Enable box selection with mouse drag on empty canvas
            // Note: This enables both panning (when no selection box) and box selection
            selectionOnDrag={true}
            // Multi-select: Ctrl/Cmd + click to add nodes to selection
            multiSelectionKeyCode="Control"
            // Reduce re-renders
            elevateNodesOnSelect={false}
          >
            <WhiteboardControls
              showMiniMap={showMinimap}
              showBackground={showGrid}
            />
            {isRectangleMode && <RectangleTool onComplete={handleRectangleComplete} />}
            {selectedNodes.length > 0 && (
              <NodeFloatingToolbar
                selectedNodes={selectedNodes}
                onUpdateNode={handleUpdateNode}
              />
            )}
          </ReactFlow>
        </div>
      </WhiteboardContextMenu>
    </div>
  );
}

/**
 * Whiteboard Canvas Component
 * 
 * Wrapper component that provides React Flow context.
 * Separates context provider from main component for better performance.
 * 
 * @param props - Component props
 * @returns Whiteboard canvas with React Flow provider
 */
export function WhiteboardCanvas(props: WhiteboardCanvasProps) {
  return (
    <ReactFlowProvider>
      <WhiteboardCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
