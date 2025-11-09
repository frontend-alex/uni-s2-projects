import { memo, useState, useEffect } from 'react';
import { Handle, Position, useReactFlow, NodeResizer } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { WHITEBOARD_CONFIG } from '../../config/whiteboard-config';

export type DiamondNodeData = {
  label?: string;
  name?: string; // External name label
  color?: string;
  size?: number;
  strokeColor?: string;
  strokeWidth?: number;
};

interface DiamondNodeProps extends NodeProps {
  onDataChange?: () => void;
}

function DiamondNode({ data, selected, id, width, height, onDataChange }: DiamondNodeProps) {
  const nodeData = data as DiamondNodeData;
  const { updateNodeData } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [label, setLabel] = useState(nodeData.label ?? nodeData.name ?? '');
  const [name, setName] = useState(nodeData.name ?? nodeData.label ?? '');
  
  // Use React Flow's width/height if available, otherwise use size from data
  const nodeSize = width || height || nodeData.size || 100;

  // Sync label and name with node data when it changes externally
  useEffect(() => {
    const newLabel = nodeData.label ?? nodeData.name ?? '';
    setLabel(newLabel);
    setName(nodeData.name ?? nodeData.label ?? '');
  }, [nodeData.label, nodeData.name]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    updateNodeData(id, { ...nodeData, label });
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
      updateNodeData(id, { ...nodeData, label });
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
  
  // Calculate corner positions for diamond (rotated square)
  // For a diamond rotated 45deg, corners are at: top, right, bottom, left (center of edges of the square)
  // But we want them at the actual visual corners
  // Since the square is rotated, the visual corners are at the edge centers
  // So we use Position but need to offset to corners
  // Actually, for a diamond, Position.Top/Right/Bottom/Left ARE the corners visually
  // The issue is React Flow places handles at edge centers, not corners
  // We'll use a wrapper with custom positioning
  
  const strokeWidth = nodeData.strokeWidth || 2;
  const strokeColor = nodeData.strokeColor || (selected ? '#3b82f6' : '#d1d5db');
  
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
          'flex items-center justify-center relative diamond-node',
          selected ? 'border-blue-500' : 'border-gray-300'
        )}
        style={{
          width: nodeSize,
          height: nodeSize,
        }}
      >
        {selected && (
        <NodeResizer
          minWidth={WHITEBOARD_CONFIG.resizer.minWidth}
          minHeight={WHITEBOARD_CONFIG.resizer.minHeight}
          isVisible={selected}
          keepAspectRatio={true}
          onResizeEnd={(event, params) => {
              // For diamonds, keep width and height the same (use width as size)
              const newSize = params.width;
              const updatedData = {
                ...nodeData,
                size: newSize,
              };
              updateNodeData(id, updatedData);
              if (onDataChange) {
                setTimeout(() => onDataChange(), 0);
              }
            }}
          />
        )}
      {/* Content area with diamond shape */}
      <div 
        className="text-center text-sm w-full flex items-center justify-center absolute inset-0"
        style={{
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          backgroundColor: nodeData.color || '#ffffff',
          zIndex: 0,
        }}
      >
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="outline-none bg-transparent text-center text-sm w-full px-2 relative z-10"
            autoFocus
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            placeholder=""
          />
        ) : (
          <div
            className="text-center text-sm cursor-text w-full px-2 relative z-10 min-h-[20px] flex items-center justify-center"
            onDoubleClick={handleDoubleClick}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ minHeight: '1.5em', pointerEvents: 'auto' }}
          >
            {label || <span className="opacity-0 select-none pointer-events-none">.</span>}
          </div>
        )}
      </div>
      
      {/* SVG overlay for the diamond border - drawn on top */}
      <svg
        width={nodeSize}
        height={nodeSize}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      >
        <polygon
          points={`${nodeSize / 2},0 ${nodeSize},${nodeSize / 2} ${nodeSize / 2},${nodeSize} 0,${nodeSize / 2}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="miter"
        />
      </svg>
      
      {/* Handles at the corners of the diamond */}
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="bottom"
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left"
      />
      </div>
    </div>
  );
}

export default memo(DiamondNode);

