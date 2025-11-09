import { memo, useState, useEffect } from 'react';
import { Handle, Position, useReactFlow, NodeResizer } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { WHITEBOARD_CONFIG } from '../../config/whiteboard-config';

export type RectangleNodeData = {
  label?: string;
  name?: string; // External name label
  color?: string;
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
};

interface RectangleNodeProps extends NodeProps {
  onDataChange?: () => void;
}

function RectangleNode({ data, selected, id, width, height, onDataChange }: RectangleNodeProps) {
  const nodeData = data as RectangleNodeData;
  const { updateNodeData } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [label, setLabel] = useState(nodeData.label ?? nodeData.name ?? '');
  const [name, setName] = useState(nodeData.name ?? nodeData.label ?? '');
  
  // Use React Flow's width/height if available, otherwise fall back to data
  const nodeWidth = width || nodeData.width || 150;
  const nodeHeight = height || nodeData.height || 100;
  
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  // Sync label and name with node data when it changes externally
  useEffect(() => {
    const newLabel = nodeData.label ?? nodeData.name ?? '';
    setLabel(newLabel);
    setName(nodeData.name ?? nodeData.label ?? '');
  }, [nodeData.label, nodeData.name]);


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

  const handleNameBlur = () => {
    setIsEditingName(false);
    const updatedData = { ...nodeData, name };
    updateNodeData(id, updatedData);
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
      setLabel(nodeData.label ?? nodeData.name ?? '');
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditingName(false);
      const updatedData = { ...nodeData, name };
      updateNodeData(id, updatedData);
      if (onDataChange) {
        setTimeout(() => onDataChange(), 0);
      }
    }
    if (e.key === 'Escape') {
      setIsEditingName(false);
      setName(nodeData.name ?? nodeData.label ?? '');
    }
  };

  return (
    <div className="relative">
      {/* External name label - positioned above the resizer */}
      {selected && (
        <div
          className="absolute"
          style={{
            top: -28,
            right: 0,
            zIndex: 1000,
            pointerEvents: 'auto',
          }}
        >
          {isEditingName ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              className="outline-none bg-background/95 backdrop-blur-sm border rounded px-2 py-0.5 text-xs min-w-[60px] max-w-[120px] shadow-sm"
              autoFocus
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              style={{ fontSize: '11px' }}
            />
          ) : (
            <div
              className="bg-background/95 backdrop-blur-sm border rounded px-2 py-0.5 text-xs cursor-text whitespace-nowrap max-w-[120px] truncate shadow-sm hover:bg-background"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditingName(true);
              }}
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: '11px' }}
              title={name}
            >
              {name}
            </div>
          )}
        </div>
      )}
      <div
        className={cn(
          'shadow-lg rounded-md border-2 min-w-[150px] min-h-[100px] bg-white flex items-center justify-center relative',
          selected ? 'border-blue-500' : 'border-gray-300'
        )}
        style={{
          backgroundColor: nodeData.color || '#ffffff',
          width: nodeWidth,
          height: nodeHeight,
          borderWidth: nodeData.strokeWidth || 2,
          borderColor: nodeData.strokeColor || (selected ? '#3b82f6' : '#d1d5db'),
        }}
      >
        {selected && (
        <NodeResizer
          minWidth={WHITEBOARD_CONFIG.resizer.minWidth}
          minHeight={WHITEBOARD_CONFIG.resizer.minHeight}
          isVisible={selected}
          onResizeEnd={(event, params) => {
              const updatedData = {
                ...nodeData,
                width: params.width,
                height: params.height,
              };
              updateNodeData(id, updatedData);
              if (onDataChange) {
                setTimeout(() => onDataChange(), 0);
              }
            }}
          />
        )}
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
          placeholder=""
        />
        ) : (
          <div
            className="text-center cursor-text w-full px-2 min-h-[20px] flex items-center justify-center"
            onDoubleClick={handleDoubleClick}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ minHeight: '1.5em', pointerEvents: 'auto' }}
          >
            {label || <span className="opacity-0 select-none pointer-events-none">.</span>}
          </div>
        )}
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
      </div>
    </div>
  );
}

export default memo(RectangleNode);

