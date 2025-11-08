import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

export type DefaultNodeData = {
  label?: string;
};

function DefaultNode({ data, selected }: NodeProps) {
  const nodeData = data as DefaultNodeData;
  return (
    <div
      className={cn(
        'px-4 py-2 shadow-md rounded-md border-2 bg-white min-w-[120px]',
        selected ? 'border-blue-500' : 'border-gray-300'
      )}
    >
      <Handle type="target" position={Position.Top} id="top" />
      <div>{nodeData.label || 'Node'}</div>
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
    </div>
  );
}

export default memo(DefaultNode);

