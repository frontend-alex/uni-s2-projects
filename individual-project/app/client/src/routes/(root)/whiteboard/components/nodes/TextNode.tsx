import { memo, useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

export type TextNodeData = {
  text?: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
};

interface TextNodeProps extends NodeProps {
  onDataChange?: () => void;
}

function TextNode({ data, selected, id, onDataChange }: TextNodeProps) {
  const nodeData = data as TextNodeData;
  const { updateNodeData } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(nodeData.text || 'Double click to edit');

  // Sync text with node data when it changes externally
  useEffect(() => {
    setText(nodeData.text || 'Double click to edit');
  }, [nodeData.text]);

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
          onBlur={() => {
            setIsEditing(false);
            updateNodeData(id, { ...nodeData, text });
            // Notify parent to trigger save
            if (onDataChange) {
              setTimeout(() => onDataChange(), 0);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsEditing(false);
              updateNodeData(id, { ...nodeData, text });
              // Notify parent to trigger save
              if (onDataChange) {
                setTimeout(() => onDataChange(), 0);
              }
            }
            if (e.key === 'Escape') {
              setIsEditing(false);
              setText(nodeData.text || 'Double click to edit');
            }
          }}
          className="outline-none bg-transparent text-center"
          style={{
            fontSize: nodeData.fontSize || 16,
            color: nodeData.color || '#000000',
            fontWeight: nodeData.bold ? 'bold' : 'normal',
            fontStyle: nodeData.italic ? 'italic' : 'normal',
          }}
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div
          onDoubleClick={() => setIsEditing(true)}
          className="text-center cursor-text"
          style={{
            fontSize: nodeData.fontSize || 16,
            color: nodeData.color || '#000000',
            fontWeight: nodeData.bold ? 'bold' : 'normal',
            fontStyle: nodeData.italic ? 'italic' : 'normal',
          }}
        >
          {text}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
    </div>
  );
}

export default memo(TextNode);

