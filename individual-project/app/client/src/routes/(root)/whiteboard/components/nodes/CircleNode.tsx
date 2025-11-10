/**
 * Circle Node Component
 * 
 * A circle-shaped node that uses DefaultNode as its base.
 * 
 * @module whiteboard/components/nodes/CircleNode
 */

import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import DefaultNode from './DefaultNode';

export type CircleNodeData = {
  label?: string;
  name?: string;
  color?: string;
  size?: number;
  strokeColor?: string;
  strokeWidth?: number;
};

interface CircleNodeProps extends NodeProps {
  onDataChange?: () => void;
}

/**
 * Circle Node Component
 * 
 * Wrapper around DefaultNode with circle shape.
 */
function CircleNode(props: CircleNodeProps) {
  return <DefaultNode {...props} shapeOverride="circle" />;
}

export default memo(CircleNode);
