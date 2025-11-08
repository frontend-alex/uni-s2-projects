import { memo, useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

export type CircleNodeData = {
  label?: string;
  color?: string;
  size?: number;
  strokeColor?: string;
  strokeWidth?: number;
};

interface CircleNodeProps extends NodeProps {
  onDataChange?: () => void;
}

function CircleNode({ data, selected, id, onDataChange }: CircleNodeProps) {
  const nodeData = data as CircleNodeData;
  const { updateNodeData } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(nodeData.label || 'Circle');
  const size = nodeData.size || 100;
  
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  // Sync label with node data when it changes externally
  useEffect(() => {
    setLabel(nodeData.label || 'Circle');
  }, [nodeData.label]);


  const handleBlur = () => {
    setIsEditing(false);
    updateNodeData(id, { ...nodeData, label });
    // Notify parent to trigger save
    if (onDataChange) {
      setTimeout(() => onDataChange(), 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      updateNodeData(id, { ...nodeData, label });
      // Notify parent to trigger save
      if (onDataChange) {
        setTimeout(() => onDataChange(), 0);
      }
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setLabel(nodeData.label || 'Circle');
    }
  };
  
  return (
    <div
      className={cn(
        'shadow-lg rounded-full border-2 flex items-center justify-center bg-white relative',
        selected ? 'border-blue-500' : 'border-gray-300'
      )}
      style={{
        backgroundColor: nodeData.color || '#ffffff',
        width: size,
        height: size,
        borderWidth: nodeData.strokeWidth || 2,
        borderColor: nodeData.strokeColor || (selected ? '#3b82f6' : '#d1d5db'),
      }}
    >
      <Handle type="target" position={Position.Top} id="top" />
      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="outline-none bg-transparent text-center text-sm w-full px-2"
          autoFocus
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
        ) : (
          <div
            className="text-center text-sm cursor-text w-full px-2"
            onDoubleClick={handleDoubleClick}
          >
            {label}
          </div>
        )}
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
    </div>
  );
}

export default memo(CircleNode);

