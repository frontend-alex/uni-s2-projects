/**
 * Node Components Index
 * 
 * Exports all node components for use in the whiteboard.
 * Components are exported as default exports to support lazy loading.
 * 
 * @module whiteboard/components/nodes
 */

// Export node components as default exports for lazy loading
export { default as RectangleNode } from './RectangleNode';
export { default as CircleNode } from './CircleNode';
export { default as TextNode } from './TextNode';
export { default as ImageNode } from './ImageNode';
export { default as DiamondNode } from './DiamondNode';
export { default as DefaultNode } from './DefaultNode';

// Export node data types
export type { RectangleNodeData } from './RectangleNode';
export type { CircleNodeData } from './CircleNode';
export type { TextNodeData } from './TextNode';
export type { ImageNodeData } from './ImageNode';
export type { DiamondNodeData } from './DiamondNode';
export type { DefaultNodeData } from './DefaultNode';
