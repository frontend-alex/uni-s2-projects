/**
 * Diamond Node Component
 * 
 * A diamond-shaped node that uses DefaultNode as its base.
 * 
 * @module whiteboard/components/nodes/DiamondNode
 */

import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import DefaultNode from './DefaultNode';

export type DiamondNodeData = {
  label?: string;
  name?: string;
  color?: string;
  size?: number;
  strokeColor?: string;
  strokeWidth?: number;
};

interface DiamondNodeProps extends NodeProps {
  onDataChange?: () => void;
}

/**
 * Diamond Node Component
 * 
 * Wrapper around DefaultNode with diamond shape.
 */
function DiamondNode(props: DiamondNodeProps) {
  return <DefaultNode {...props} shapeOverride="diamond" />;
}

export default memo(DiamondNode);
