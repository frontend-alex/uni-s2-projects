import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { Image as ImageIcon } from 'lucide-react';

export type ImageNodeData = {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
};

function ImageNode({ data, selected }: NodeProps) {
  const nodeData = data as ImageNodeData;
  return (
    <div
      className={cn(
        'shadow-lg rounded-md border-2 overflow-hidden bg-white',
        selected ? 'border-blue-500' : 'border-gray-300'
      )}
      style={{
        width: nodeData.width || 200,
        height: nodeData.height || 200,
      }}
    >
      <Handle type="target" position={Position.Top} id="top" />
      {nodeData.src ? (
        <img
          src={nodeData.src}
          alt={nodeData.alt || 'Image'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <ImageIcon className="w-12 h-12 text-gray-400" />
        </div>
      )}
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
    </div>
  );
}

export default memo(ImageNode);

