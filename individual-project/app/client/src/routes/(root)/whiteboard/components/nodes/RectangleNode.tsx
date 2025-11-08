import { memo, useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

export type RectangleNodeData = {
  label?: string;
  color?: string;
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
};

interface RectangleNodeProps extends NodeProps {
  onDataChange?: () => void;
}

function RectangleNode({ data, selected, id, onDataChange }: RectangleNodeProps) {
  const nodeData = data as RectangleNodeData;
  const { updateNodeData } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(nodeData.label || 'Rectangle');
  
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  // Sync label with node data when it changes externally
  useEffect(() => {
    setLabel(nodeData.label || 'Rectangle');
  }, [nodeData.label]);


  const handleBlur = () => {
    setIsEditing(false);
    // Update node data
    const updatedData = { ...nodeData, label };
    updateNodeData(id, updatedData);
    // Notify parent to trigger save
    if (onDataChange) {
      setTimeout(() => onDataChange(), 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      const updatedData = { ...nodeData, label };
      updateNodeData(id, updatedData);
      // Notify parent to trigger save
      if (onDataChange) {
        setTimeout(() => onDataChange(), 0);
      }
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setLabel(nodeData.label || 'Rectangle');
    }
  };

  return (
    <div
      className={cn(
        'shadow-lg rounded-md border-2 min-w-[150px] min-h-[100px] bg-white flex items-center justify-center relative',
        selected ? 'border-blue-500' : 'border-gray-300'
      )}
      style={{
        backgroundColor: nodeData.color || '#ffffff',
        width: nodeData.width || 150,
        height: nodeData.height || 100,
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
          className="outline-none bg-transparent text-center w-full px-2"
          autoFocus
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
        ) : (
          <div
            className="text-center cursor-text w-full px-2"
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

export default memo(RectangleNode);

