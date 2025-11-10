/**
 * Rectangle Node Component
 * 
 * A rectangle-shaped node that uses DefaultNode as its base.
 * 
 * @module whiteboard/components/nodes/RectangleNode
 */

import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import DefaultNode from './DefaultNode';

export type RectangleNodeData = {
  label?: string;
  name?: string;
  color?: string;
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
};

interface RectangleNodeProps extends NodeProps {
  onDataChange?: () => void;
}

/**
 * Rectangle Node Component
 * 
 * Wrapper around DefaultNode with rectangle shape.
 */
function RectangleNode(props: RectangleNodeProps) {
  return <DefaultNode {...props} shapeOverride="rectangle" />;
}

export default memo(RectangleNode);
