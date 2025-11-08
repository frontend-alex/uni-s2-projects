import { memo, useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

export type DiamondNodeData = {
  label?: string;
  color?: string;
  size?: number;
  strokeColor?: string;
  strokeWidth?: number;
};

interface DiamondNodeProps extends NodeProps {
  onDataChange?: () => void;
}

function DiamondNode({ data, selected, id, onDataChange }: DiamondNodeProps) {
  const nodeData = data as DiamondNodeData;
  const { updateNodeData } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(nodeData.label || 'Diamond');
  const size = nodeData.size || 100;

  // Sync label with node data when it changes externally
  useEffect(() => {
    setLabel(nodeData.label || 'Diamond');
  }, [nodeData.label]);

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
      setLabel(nodeData.label || 'Diamond');
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
    <div
      className={cn(
        'flex items-center justify-center  relative diamond-node',
        selected ? 'border-blue-500' : 'border-gray-300'
      )}
      style={{
        width: size,
        height: size,
      }}
    >
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
          />
        ) : (
          <div
            className="text-center text-sm cursor-text w-full px-2 relative z-10"
            onDoubleClick={handleDoubleClick}
          >
            {label}
          </div>
        )}
      </div>
      
      {/* SVG overlay for the diamond border - drawn on top */}
      <svg
        width={size}
        height={size}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      >
        <polygon
          points={`${size / 2},0 ${size},${size / 2} ${size / 2},${size} 0,${size / 2}`}
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
  );
}

export default memo(DiamondNode);

