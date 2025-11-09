/**
 * Text Node Component
 * 
 * A node type for displaying and editing text on the whiteboard.
 * Supports inline text editing via double-click.
 * 
 * @module whiteboard/components/nodes/TextNode
 */

import { memo, useState, useEffect, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

/**
 * Data structure for TextNode
 */
export type TextNodeData = {
  /** Text content of the node */
  text?: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Text color (hex string) */
  color?: string;
  /** Whether text is bold */
  bold?: boolean;
  /** Whether text is italic */
  italic?: boolean;
};

/**
 * Props for TextNode component
 */
interface TextNodeProps extends NodeProps {
  /** Callback when node data changes (triggers save) */
  onDataChange?: () => void;
}

/**
 * Text Node Component
 * 
 * Displays text that can be edited by double-clicking.
 * Supports text styling (font size, color, bold, italic).
 * 
 * @param props - Node props from React Flow
 * @returns Text node component
 * 
 * @example
 * ```tsx
 * <TextNode
 *   data={{ text: 'Hello World', fontSize: 16 }}
 *   selected={false}
 *   id="text-1"
 *   onDataChange={() => save()}
 * />
 * ```
 */
function TextNode({ data, selected, id, onDataChange }: TextNodeProps) {
  const nodeData = data as TextNodeData;
  const { updateNodeData } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(nodeData.text || 'Double click to edit');

  /**
   * Sync text with node data when it changes externally
   */
  useEffect(() => {
    setText(nodeData.text || 'Double click to edit');
  }, [nodeData.text]);

  /**
   * Handle text blur - save changes
   */
  const handleBlur = useCallback(() => {
    setIsEditing(false);
    updateNodeData(id, { ...nodeData, text });
    
    // Notify parent to trigger save
    if (onDataChange) {
      setTimeout(() => onDataChange(), 0);
    }
  }, [id, nodeData, text, updateNodeData, onDataChange]);

  /**
   * Handle key down - Enter to save, Escape to cancel
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        setIsEditing(false);
        updateNodeData(id, { ...nodeData, text });
        
        // Notify parent to trigger save
        if (onDataChange) {
          setTimeout(() => onDataChange(), 0);
        }
      } else if (e.key === 'Escape') {
        setIsEditing(false);
        // Reset to original value
        setText(nodeData.text || 'Double click to edit');
      }
    },
    [id, nodeData, text, updateNodeData, onDataChange]
  );

  /**
   * Handle double click - start editing
   */
  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  return (
    <div
      className={cn(
        'px-3 py-2 shadow-lg rounded-md border-2 min-w-[100px] bg-transparent',
        selected ? 'border-blue-500' : 'border-transparent'
      )}
    >
      <Handle type="target" position={Position.Top} id="top" />
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="outline-none bg-transparent text-center"
          style={{
            fontSize: nodeData.fontSize || 16,
            color: nodeData.color || '#000000',
            fontWeight: nodeData.bold ? 'bold' : 'normal',
            fontStyle: nodeData.italic ? 'italic' : 'normal',
          }}
          autoFocus
          onClick={(e) => e.stopPropagation()}
          placeholder="Enter text..."
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          className="text-center cursor-text min-h-[20px] flex items-center justify-center"
          style={{
            fontSize: nodeData.fontSize || 16,
            color: nodeData.color || '#000000',
            fontWeight: nodeData.bold ? 'bold' : 'normal',
            fontStyle: nodeData.italic ? 'italic' : 'normal',
            minHeight: '1.5em',
            pointerEvents: 'auto',
          }}
        >
          {text || <span className="opacity-0 select-none pointer-events-none">.</span>}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
    </div>
  );
}

export default memo(TextNode);
