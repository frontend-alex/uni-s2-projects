import { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider,
  MarkerType,
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

import { WhiteboardContextMenu } from './context-menu/WhiteboardContextMenu';
import { WhiteboardControls } from './controls/WhiteboardControls';
import { RectangleTool } from './tools/RectangleTool';
import { AnimatedEdge } from './edges/AnimatedEdge';
import { NodeFloatingToolbar } from './NodeFloatingToolbar';
import { useWhiteboardStorage } from '../hooks/useWhiteboardStorage';
import { useDocument } from '@/hooks/document/use-document';
import { useReactFlow } from '@xyflow/react';
import {
  WHITEBOARD_CONFIG,
  isUndoShortcut,
  isRedoShortcut,
  isCopyShortcut,
  isPasteShortcut,
  isDeleteShortcut,
} from '../config/whiteboard-config';

import {
  RectangleNode,
  CircleNode,
  TextNode,
  ImageNode,
  DiamondNode,
  DefaultNode,
} from './nodes';

import type {
  RectangleNodeData,
  CircleNodeData,
  TextNodeData,
  ImageNodeData,
  DiamondNodeData,
  DefaultNodeData,
} from './nodes';

// Create node types with save callback
const createNodeTypes = (onDataChange: () => void): NodeTypes => ({
  rectangle: (props: any) => <RectangleNode {...props} onDataChange={onDataChange} />,
  circle: (props: any) => <CircleNode {...props} onDataChange={onDataChange} />,
  text: (props: any) => <TextNode {...props} onDataChange={onDataChange} />,
  image: ImageNode as any,
  diamond: (props: any) => <DiamondNode {...props} onDataChange={onDataChange} />,
  default: DefaultNode as any,
});

const edgeTypes: EdgeTypes = {
  animated: AnimatedEdge,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

interface WhiteboardCanvasProps {
  documentId?: number;
}

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
  
  const { getNodes, updateNodeData } = useReactFlow();
  
  // History management - using ref to avoid stale closures
  const historyRef = useRef<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const historyIndexRef = useRef(-1);
  const [, setHistoryUpdate] = useState(0); // Trigger re-render when history changes
  const isDraggingRef = useRef(false);
  const dragEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveToHistory = useCallback((nodes: Node[], edges: Edge[]) => {
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push({ 
      nodes: JSON.parse(JSON.stringify(nodes)), 
      edges: JSON.parse(JSON.stringify(edges)) 
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
  
  // Callback to trigger save when node data changes
  const handleNodeDataChange = useCallback(() => {
    if (documentId && isInitialized) {
      const currentNodes = getNodes();
      setTimeout(() => {
        save(currentNodes, edges);
      }, 100);
    }
  }, [documentId, isInitialized, getNodes, save, edges]);
  
  // Handle node property updates
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

  // Node management
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
  
  // Handle selection changes separately to avoid loops
  const prevSelectedNodeIdsRef = useRef<string>('');
  const prevSelectedEdgeIdsRef = useRef<string>('');
  
  const onSelectionChange = useCallback(({ nodes: selectedNodesFromFlow, edges: selectedEdgesFromFlow }: { nodes: Node[]; edges: Edge[] }) => {
    // Create stable IDs string for comparison
    const newNodeIds = selectedNodesFromFlow.map((n) => n.id).sort().join(',');
    const newEdgeIds = selectedEdgesFromFlow.map((e) => e.id).sort().join(',');
    
    // Only update if selection actually changed
    if (newNodeIds !== prevSelectedNodeIdsRef.current) {
      prevSelectedNodeIdsRef.current = newNodeIds;
      setSelectedNodes(selectedNodesFromFlow);
    }
    
    if (newEdgeIds !== prevSelectedEdgeIdsRef.current) {
      prevSelectedEdgeIdsRef.current = newEdgeIds;
      setSelectedEdges(selectedEdgesFromFlow);
    }
  }, []);

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
  
  // Connection validation - allow all valid connections
  const isValidConnection = useCallback((connection: Connection | Edge) => {
    // Prevent self-connections
    if (connection.source === connection.target) {
      return false;
    }
    // Allow all other connections
    return true;
  }, []);

  // Update selected edges when edge type changes (real-time, no delete/recreate)
  const prevEdgeTypeRef = useRef(edgeType);
  const isUpdatingEdgesRef = useRef(false);
  const selectedEdgeIdsRef = useRef<string[]>([]);
  
  // Update ref when selected edges change
  useEffect(() => {
    selectedEdgeIdsRef.current = selectedEdges.map((e) => e.id);
  }, [selectedEdges.map((e) => e.id).join(',')]);
  
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

  const onAddNode = useCallback(
    (type: string, position: { x: number; y: number }) => {
      const id = `${type}-${Date.now()}`;
      let newNode: Node;

      switch (type) {
        case 'rectangle':
          newNode = {
            id,
            type: 'rectangle',
            position,
            data: {
              label: WHITEBOARD_CONFIG.node.defaults.rectangle.label,
              name: WHITEBOARD_CONFIG.node.defaults.rectangle.name,
              color: WHITEBOARD_CONFIG.node.defaults.rectangle.color,
              width: WHITEBOARD_CONFIG.node.defaults.rectangle.width,
              height: WHITEBOARD_CONFIG.node.defaults.rectangle.height,
            } as RectangleNodeData,
            width: WHITEBOARD_CONFIG.node.defaults.rectangle.width,
            height: WHITEBOARD_CONFIG.node.defaults.rectangle.height,
          };
          break;
        case 'circle':
          newNode = {
            id,
            type: 'circle',
            position,
            data: {
              label: WHITEBOARD_CONFIG.node.defaults.circle.label,
              name: WHITEBOARD_CONFIG.node.defaults.circle.name,
              color: WHITEBOARD_CONFIG.node.defaults.circle.color,
              size: WHITEBOARD_CONFIG.node.defaults.circle.size,
            } as CircleNodeData,
            width: WHITEBOARD_CONFIG.node.defaults.circle.size,
            height: WHITEBOARD_CONFIG.node.defaults.circle.size,
          };
          break;
        case 'text':
          newNode = {
            id,
            type: 'text',
            position,
            data: { text: 'Double click to edit' } as TextNodeData,
          };
          break;
        case 'image':
          newNode = {
            id,
            type: 'image',
            position,
            data: { src: '', alt: 'Image' } as ImageNodeData,
          };
          break;
        case 'diamond':
          newNode = {
            id,
            type: 'diamond',
            position,
            data: {
              label: WHITEBOARD_CONFIG.node.defaults.diamond.label,
              name: WHITEBOARD_CONFIG.node.defaults.diamond.name,
              color: WHITEBOARD_CONFIG.node.defaults.diamond.color,
              size: WHITEBOARD_CONFIG.node.defaults.diamond.size,
            } as DiamondNodeData,
            width: WHITEBOARD_CONFIG.node.defaults.diamond.size,
            height: WHITEBOARD_CONFIG.node.defaults.diamond.size,
          };
          break;
        default:
          newNode = {
            id,
            type: 'default',
            position,
            data: { label: 'Node' } as DefaultNodeData,
          };
      }

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

  const onDelete = useCallback(
    (nodesToDelete: Node[], edgesToDelete: Edge[]) => {
      const nodeIds = new Set(nodesToDelete.map((n) => n.id));
      
      setNodes((nds) => {
        const newNodes = nds.filter((n) => !nodeIds.has(n.id));
        setEdges((eds) => {
          const edgeIds = new Set(edgesToDelete.map((e) => e.id));
          const connectedEdgeIds = new Set(
            eds
              .filter((e) => nodeIds.has(e.source) || nodeIds.has(e.target))
              .map((e) => e.id)
          );
          const allEdgeIds = new Set([...Array.from(edgeIds), ...Array.from(connectedEdgeIds)]);
          const newEdges = eds.filter((e) => !allEdgeIds.has(e.id));
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

      setSelectedNodes([]);
      setSelectedEdges([]);
    },
    [saveToHistory, documentId, isInitialized, save]
  );
  
  // Keyboard shortcuts
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

  const onDuplicate = useCallback(
    (nodesToDuplicate: Node[]) => {
      const newNodes = nodesToDuplicate.map((node) => ({
        ...node,
        id: `${node.type}-${Date.now()}-${Math.random()}`,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
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

  const onClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNodes([]);
    setSelectedEdges([]);
    saveToHistory([], []);
    // Auto-save (useAutoSave handles debouncing)
    if (documentId && isInitialized) {
      setTimeout(() => {
        save([], []);
      }, 0);
    }
  }, [saveToHistory, documentId, isInitialized, save]);

  const handleSave = useCallback(() => {
    // Fallback: download as JSON file (only when no documentId)
    if (!documentId) {
      const data = JSON.stringify({ nodes, edges }, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `whiteboard-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    // When documentId exists, saving happens automatically via useAutoSave
  }, [nodes, edges, documentId]);

  const handleLoad = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            if (data.nodes && data.edges) {
              setNodes(data.nodes);
              setEdges(data.edges);
              saveToHistory(data.nodes, data.edges);
              // Auto-save loaded data (useAutoSave handles debouncing)
              if (documentId && isInitialized) {
                setTimeout(() => {
                  save(data.nodes, data.edges);
                }, 0);
              }
            }
          } catch (error) {
            console.error('Error loading file:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [saveToHistory, documentId, isInitialized, save]);

  // Rectangle tool handler
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

  // Load whiteboard data on mount
  useEffect(() => {
    if (!documentId || isInitialized) return;

    const loadWhiteboardData = () => {
      // Try to load from backend first
      if (documentResponse?.data?.content) {
        try {
          const parsed = JSON.parse(documentResponse.data.content);
          if (parsed.nodes && parsed.edges) {
            // Ensure nodes have width/height from data
            const nodesWithDimensions = (parsed.nodes || []).map((node: Node) => {
              const nodeData = { ...(node.data || {}) } as RectangleNodeData | CircleNodeData | DiamondNodeData;
              // Ensure label/name exist (default to empty string)
              if (nodeData.label === undefined && nodeData.name === undefined) {
                nodeData.label = '';
                nodeData.name = '';
              } else if (nodeData.label === undefined) {
                nodeData.label = nodeData.name ?? '';
              } else if (nodeData.name === undefined) {
                nodeData.name = nodeData.label ?? '';
              }
              
              if (node.type === 'rectangle') {
                return {
                  ...node,
                  data: nodeData,
                  width: (nodeData as RectangleNodeData).width || node.width || 150,
                  height: (nodeData as RectangleNodeData).height || node.height || 100,
                };
              } else if (node.type === 'circle' || node.type === 'diamond') {
                const size = (nodeData as CircleNodeData | DiamondNodeData).size || node.width || 100;
                return {
                  ...node,
                  data: nodeData,
                  width: size,
                  height: size,
                };
              }
              return { ...node, data: nodeData };
            });
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
        // Ensure nodes have width/height from data
        const nodesWithDimensions = localData.nodes.map((node: Node) => {
          const nodeData = { ...(node.data || {}) } as RectangleNodeData | CircleNodeData | DiamondNodeData;
          // Ensure label/name exist (default to empty string)
          if (nodeData.label === undefined && nodeData.name === undefined) {
            nodeData.label = '';
            nodeData.name = '';
          } else if (nodeData.label === undefined) {
            nodeData.label = nodeData.name ?? '';
          } else if (nodeData.name === undefined) {
            nodeData.name = nodeData.label ?? '';
          }
          
          if (node.type === 'rectangle') {
            return {
              ...node,
              data: nodeData,
              width: (nodeData as RectangleNodeData).width || node.width || 150,
              height: (nodeData as RectangleNodeData).height || node.height || 100,
            };
          } else if (node.type === 'circle' || node.type === 'diamond') {
            const size = (nodeData as CircleNodeData | DiamondNodeData).size || node.width || 100;
            return {
              ...node,
              data: nodeData,
              width: size,
              height: size,
            };
          }
          return { ...node, data: nodeData };
        });
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

  // Initialize history only once on mount
  useEffect(() => {
    if (historyRef.current.length === 0 && nodes.length === 0 && edges.length === 0 && isInitialized) {
      saveToHistory([], []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

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
        edgeType={edgeType}
        onEdgeTypeChange={setEdgeType}
        showGrid={showGrid}
        onGridToggle={setShowGrid}
        showMinimap={showMinimap}
        onMinimapToggle={setShowMinimap}
        isRectangleMode={isRectangleMode}
        onRectangleModeToggle={setIsRectangleMode}
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
            nodeTypes={createNodeTypes(handleNodeDataChange)}
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
          >
            <WhiteboardControls
              showMiniMap={showMinimap}
              showBackground={showGrid}
              isRectangleMode={isRectangleMode}
              onRectangleModeToggle={setIsRectangleMode}
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

export function WhiteboardCanvas(props: WhiteboardCanvasProps) {
  return (
    <ReactFlowProvider>
      <WhiteboardCanvasInner {...props} />
    </ReactFlowProvider>
  );
}

