/**
 * Default Node Component
 * 
 * A flexible base node component that supports different shapes and styling.
 * Used as the foundation for all shape nodes (circle, rectangle, diamond, etc.)
 * 
 * @module whiteboard/components/nodes/DefaultNode
 */

import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import type { NodeProps } from '@xyflow/react';
import { Handle, NodeResizer, Position, useReactFlow } from '@xyflow/react';
import { memo, useEffect, useState } from 'react';
import { WHITEBOARD_CONFIG } from '../../config/whiteboard-config';

/**
 * Shape type for the node
 */
export type NodeShape = 'default' | 'circle' | 'rectangle' | 'diamond';

/**
 * Data structure for DefaultNode
 */
export type DefaultNodeData = {
  /** Label text displayed in the node */
  label?: string;
  /** External name label displayed above the node */
  name?: string;
  /** Background color (hex string) */
  color?: string;
  /** Width of the node (for rectangle) */
  width?: number;
  /** Height of the node (for rectangle) */
  height?: number;
  /** Size of the node (for circle and diamond) */
  size?: number;
  /** Stroke/border color (hex string) */
  strokeColor?: string;
  /** Stroke/border width in pixels */
  strokeWidth?: number;
  /** Shape type - determines visual appearance */
  shape?: NodeShape;
};

/**
 * Props for DefaultNode component
 */
interface DefaultNodeProps extends NodeProps {
  /** Callback when node data changes (triggers save) */
  onDataChange?: () => void;
  /** Override shape type from data */
  shapeOverride?: NodeShape;
}

/**
 * Default Node Component
 * 
 * A flexible node component that supports different shapes (default, circle, rectangle, diamond).
 * Handles editing, resizing, styling, and connection handles.
 * 
 * @param props - Node props from React Flow
 * @returns Default node component
 */
function DefaultNode({ data, selected, id, width, height, onDataChange, shapeOverride }: DefaultNodeProps) {

  const { theme } = useTheme();
  
  // Resolve theme - if "system", check the actual system theme
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme === 'dark' ? 'dark' : 'light';
  });
  
  // Update resolved theme when theme changes or system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateTheme = () => {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      };
      updateTheme();
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    } else {
      setResolvedTheme(theme === 'dark' ? 'dark' : 'light');
    }
  }, [theme]);

  const nodeData = data as DefaultNodeData;
  const { updateNodeData } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [label, setLabel] = useState(nodeData.label ?? nodeData.name ?? '');
  const [name, setName] = useState(nodeData.name ?? nodeData.label ?? '');
  
  // Determine shape - use override, then data shape, then default
  const shape = shapeOverride || nodeData.shape || 'default';
  
  // Get display name for the shape
  const getShapeDisplayName = (shapeType: NodeShape): string => {
    const shapeMap: Record<NodeShape, string> = {
      circle: 'Circle',
      rectangle: 'Rectangle',
      diamond: 'Diamond',
      default: 'Node',
    };
    return shapeMap[shapeType] || 'Node';
  };
  
  const shapeDisplayName = getShapeDisplayName(shape);
  
  // Calculate dimensions based on shape
  const isCircle = shape === 'circle';
  const isDiamond = shape === 'diamond';
  const isRectangle = shape === 'rectangle';
  
  // For circle and diamond, use size (keep aspect ratio)
  // For rectangle, use width/height (can be different)
  const nodeWidth = isCircle || isDiamond 
    ? (width || height || nodeData.size || 100)
    : (width || nodeData.width || 150);
  const nodeHeight = isCircle || isDiamond
    ? (width || height || nodeData.size || 100)
    : (height || nodeData.height || 100);
  
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

  // Handle resize end based on shape
  const handleResizeEnd = (_event: any, params: { width: number; height: number }) => {
    if (isCircle || isDiamond) {
      // For circle and diamond, use width as size (keep aspect ratio)
      const newSize = params.width;
      const updatedData = {
        ...nodeData,
        size: newSize,
      };
      updateNodeData(id, updatedData);
    } else {
      // For rectangle and default, use width and height
      const updatedData = {
        ...nodeData,
        width: params.width,
        height: params.height,
      };
      updateNodeData(id, updatedData);
    }
    if (onDataChange) {
      setTimeout(() => onDataChange(), 0);
    }
  };

  // Style values
  // If node has explicit custom color, use it. Otherwise, use theme-based color.
  // This allows nodes with custom colors to keep them, while theme-based nodes update when theme changes.
  const hasCustomColor = nodeData.color && nodeData.color.trim() !== '';
  const hasCustomBorderColor = nodeData.strokeColor && nodeData.strokeColor.trim() !== '';
  
  const strokeWidth = nodeData.strokeWidth || 1;
  
  // Base classes for the container
  // For diamond, we don't use border classes since we use SVG for border
  const containerClasses = cn(
    'shadow-lg flex items-center justify-center relative',
    !isDiamond && 'border-2',
    isCircle && 'rounded-full',
    (isRectangle || shape === 'default') && 'rounded-md',
    isRectangle && 'min-w-[150px] min-h-[100px]',
    // Use theme-based background: accent for dark (muted gray), card for light
    !hasCustomColor && (resolvedTheme === 'dark' ? 'bg-accent' : 'bg-card'),
    // Border will be set via inline style to use accent color
  );
  
  // Inline styles - only apply when custom colors are set or for diamond border
  const containerStyle: React.CSSProperties = {
    width: nodeWidth,
    height: nodeHeight,
  };
  
  // Apply custom background color if set
  if (hasCustomColor) {
    containerStyle.backgroundColor = nodeData.color;
  }
  
  if (!isDiamond) {
    containerStyle.borderWidth = strokeWidth;
    if (hasCustomBorderColor) {
      containerStyle.borderColor = nodeData.strokeColor;
    } else if (selected) {
      containerStyle.borderColor = 'transparent';
    } else {
      containerStyle.borderColor = 'var(--border)';
    }
  }
  
  // Diamond uses clipPath
  if (isDiamond) {
    containerStyle.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
  }
  
  // Get border color for diamond SVG (uses theme border color or custom)
  const diamondBorderColor = hasCustomBorderColor 
    ? nodeData.strokeColor 
    : (selected ? 'transparent' : 'var(--border)');

  return (
    <div className="relative">
      {/* External name label - positioned above the node */}
        <div
          className="absolute"
          style={{
            top: -30,
            right: 0,
            zIndex: 1000,
            pointerEvents: 'auto',
          }}
        >
          {isEditingName ? (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value as string)}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              className="input no-ring"
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
              onClick={(e) => {
                // Allow Ctrl/Cmd+Click to bubble up for multi-selection
                if (e.ctrlKey || e.metaKey) {
                  return;
                }
                e.stopPropagation();
              }}
              style={{ fontSize: '11px' }}
              title={name || `${shapeDisplayName} Node`}
            >
              {name || `${shapeDisplayName} Node`}
            </div>
          )}
        </div>
      
      {/* Main node container */}
      <div
        className={containerClasses}
        style={containerStyle}
      >
        {/* Resizer - only show when selected */}
        {/* 
          Note: NodeResizer from React Flow may emit browser warnings about non-passive touchstart 
          event listeners. These warnings are harmless and expected - the resizer needs to prevent 
          default touch behavior to function correctly, so it cannot use passive event listeners.
          These warnings do not affect functionality and can be safely ignored.
        */}
        {selected && (
          <NodeResizer
            minWidth={WHITEBOARD_CONFIG.resizer.minWidth}
            minHeight={WHITEBOARD_CONFIG.resizer.minHeight}
            isVisible={selected}
            keepAspectRatio={isCircle || isDiamond}
            onResizeEnd={handleResizeEnd}
          />
        )}
        
        {/* Content area with editing support - rendered first so it's behind the border */}
        <div className="w-full h-full flex items-center justify-center relative" style={{ zIndex: isDiamond ? 1 : 0 }}>
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
              placeholder=""
            />
          ) : (
            <div
              className="text-center text-sm cursor-text w-full px-2 min-h-[20px] flex items-center justify-center"
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleDoubleClick();
              }}
              onClick={(e) => {
                // Allow Ctrl/Cmd+Click to bubble up for multi-selection
                if (e.ctrlKey || e.metaKey) {
                  return;
                }
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                // Allow Ctrl/Cmd+MouseDown to bubble up for multi-selection
                if (e.ctrlKey || e.metaKey) {
                  return;
                }
                e.stopPropagation();
              }}
              style={{ minHeight: '1.5em', pointerEvents: 'auto' }}
            >
              {label || <span className="opacity-0 select-none pointer-events-none">.</span>}
            </div>
          )}
        </div>
        
        {/* Diamond border overlay (SVG) - only for diamond shape, rendered on top */}
        {isDiamond && (
          <svg
            width={nodeWidth}
            height={nodeHeight}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 2 }}
          >
            <polygon
              points={`${nodeWidth / 2},0 ${nodeWidth},${nodeHeight / 2} ${nodeWidth / 2},${nodeHeight} 0,${nodeHeight / 2}`}
              fill="none"
              stroke={diamondBorderColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="miter"
            />
          </svg>
        )}
        
        {/* Connection handles */}
        <Handle type="target" position={Position.Top} id="top" />
        <Handle type="source" position={Position.Bottom} id="bottom" />
        <Handle type="source" position={Position.Right} id="right" />
        <Handle type="target" position={Position.Left} id="left" />
      </div>
    </div>
  );
}

export default memo(DefaultNode);
