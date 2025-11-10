/**
 * Node Utility Functions
 * 
 * Shared utility functions for node operations to reduce code duplication
 * and ensure consistent behavior across all node types.
 * 
 * @module whiteboard/utils/node-utils
 */

import type { Node } from '@xyflow/react';
import type {
  RectangleNodeData,
  CircleNodeData,
  DiamondNodeData,
} from '../components/nodes';
import { WHITEBOARD_CONFIG } from '../config/whiteboard-config';

/**
 * Ensures a node has default label and name properties.
 * If both are undefined, sets them to empty strings.
 * If one is defined, syncs the other.
 * 
 * @param nodeData - The node data object to normalize
 * @returns Normalized node data with label and name properties
 * 
 * @example
 * ```typescript
 * const normalized = normalizeNodeLabels({ color: '#fff' });
 * // Returns: { color: '#fff', label: '', name: '' }
 * ```
 */
export function normalizeNodeLabels(
  nodeData: RectangleNodeData | CircleNodeData | DiamondNodeData
): RectangleNodeData | CircleNodeData | DiamondNodeData {
  const normalized = { ...nodeData };
  
  // Ensure label/name exist (default to empty string)
  if (normalized.label === undefined && normalized.name === undefined) {
    normalized.label = '';
    normalized.name = '';
  } else if (normalized.label === undefined) {
    normalized.label = normalized.name ?? '';
  } else if (normalized.name === undefined) {
    normalized.name = normalized.label ?? '';
  }
  
  return normalized;
}

/**
 * Ensures a node has proper dimensions based on its type.
 * For rectangles: uses width/height from data or defaults
 * For circles/diamonds: uses size from data or defaults, syncs width/height
 * 
 * @param node - The node to ensure dimensions for
 * @returns Node with ensured dimensions
 * 
 * @example
 * ```typescript
 * const nodeWithDimensions = ensureNodeDimensions(node);
 * ```
 */
export function ensureNodeDimensions(node: Node): Node {
  const nodeData = { ...(node.data || {}) } as
    | RectangleNodeData
    | CircleNodeData
    | DiamondNodeData;
  
  const normalizedData = normalizeNodeLabels(nodeData);
  
  if (node.type === 'rectangle') {
    const rectData = normalizedData as RectangleNodeData;
    return {
      ...node,
      data: normalizedData,
      width: rectData.width || node.width || WHITEBOARD_CONFIG.node.defaults.rectangle.width,
      height: rectData.height || node.height || WHITEBOARD_CONFIG.node.defaults.rectangle.height,
    };
  }
  
  if (node.type === 'circle' || node.type === 'diamond') {
    const circleOrDiamondData = normalizedData as CircleNodeData | DiamondNodeData;
    const size = circleOrDiamondData.size || node.width || WHITEBOARD_CONFIG.node.defaults.circle.size;
    return {
      ...node,
      data: {
        ...normalizedData,
        size,
      },
      width: size,
      height: size,
    };
  }
  
  return { ...node, data: normalizedData };
}

/**
 * Creates a new node with default properties based on type.
 * 
 * @param type - The type of node to create
 * @param position - The position of the node
 * @param id - Optional custom ID (will be generated if not provided)
 * @returns A new node with default properties
 * 
 * @example
 * ```typescript
 * const newNode = createNode('rectangle', { x: 100, y: 100 });
 * ```
 */
export function createNode(
  type: string,
  position: { x: number; y: number },
  id?: string
): Node {
  const nodeId = id || `${type}-${Date.now()}-${Math.random()}`;
  
  switch (type) {
    case 'rectangle': {
      const defaults = WHITEBOARD_CONFIG.node.defaults.rectangle;
      return {
        id: nodeId,
        type: 'rectangle',
        position,
        data: {
          label: defaults.label,
          name: 'Rectangle Node',
          color: defaults.color,
          width: defaults.width,
          height: defaults.height,
        } as RectangleNodeData,
        width: defaults.width,
        height: defaults.height,
      };
    }
    
    case 'circle': {
      const defaults = WHITEBOARD_CONFIG.node.defaults.circle;
      return {
        id: nodeId,
        type: 'circle',
        position,
        data: {
          label: defaults.label,
          name: 'Circle Node',
          color: defaults.color,
          size: defaults.size,
        } as CircleNodeData,
        width: defaults.size,
        height: defaults.size,
      };
    }
    
    case 'diamond': {
      const defaults = WHITEBOARD_CONFIG.node.defaults.diamond;
      return {
        id: nodeId,
        type: 'diamond',
        position,
        data: {
          label: defaults.label,
          name: 'Diamond Node',
          color: defaults.color,
          size: defaults.size,
        } as DiamondNodeData,
        width: defaults.size,
        height: defaults.size,
      };
    }
    
    case 'text':
      return {
        id: nodeId,
        type: 'text',
        position,
        data: { text: 'Double click to edit' },
      };
    
    case 'image':
      return {
        id: nodeId,
        type: 'image',
        position,
        data: { src: '', alt: 'Image' },
      };
    
    default:
      return {
        id: nodeId,
        type: 'default',
        position,
        data: { label: 'Node', name: 'Node' },
      };
  }
}

/**
 * Updates node data while preserving type-specific properties.
 * 
 * @param node - The node to update
 * @param data - The new data to merge
 * @returns Updated node with merged data
 * 
 * @example
 * ```typescript
 * const updated = updateNodeData(node, { color: '#ff0000' });
 * ```
 */
export function updateNodeData(
  node: Node,
  data: Partial<RectangleNodeData | CircleNodeData | DiamondNodeData>
): Node {
  const updatedData = { ...node.data, ...data };
  
  if (node.type === 'rectangle') {
    const rectData = updatedData as RectangleNodeData;
    const rectUpdateData = data as Partial<RectangleNodeData>;
    return {
      ...node,
      data: updatedData,
      width: rectUpdateData.width ?? rectData.width ?? node.width ?? WHITEBOARD_CONFIG.node.defaults.rectangle.width,
      height: rectUpdateData.height ?? rectData.height ?? node.height ?? WHITEBOARD_CONFIG.node.defaults.rectangle.height,
    };
  }
  
  if (node.type === 'circle' || node.type === 'diamond') {
    const circleOrDiamondData = updatedData as CircleNodeData | DiamondNodeData;
    const circleOrDiamondUpdateData = data as Partial<CircleNodeData | DiamondNodeData>;
    const size = ('size' in circleOrDiamondUpdateData && circleOrDiamondUpdateData.size !== undefined)
      ? circleOrDiamondUpdateData.size
      : circleOrDiamondData.size ?? node.width ?? WHITEBOARD_CONFIG.node.defaults.circle.size;
    return {
      ...node,
      data: {
        ...updatedData,
        size,
      },
      width: size,
      height: size,
    };
  }
  
  // For other node types, don't try to access width/height from data
  return {
    ...node,
    data: updatedData,
  };
}

/**
 * Deep clones nodes and edges for history management.
 * Uses JSON serialization for deep cloning to avoid reference issues.
 * 
 * @param nodes - Array of nodes to clone
 * @param edges - Array of edges to clone
 * @returns Cloned nodes and edges
 * 
 * @example
 * ```typescript
 * const [clonedNodes, clonedEdges] = cloneNodesAndEdges(nodes, edges);
 * ```
 */
export function cloneNodesAndEdges(
  nodes: Node[],
  edges: any[]
): [Node[], any[]] {
  return [
    JSON.parse(JSON.stringify(nodes)),
    JSON.parse(JSON.stringify(edges)),
  ];
}

