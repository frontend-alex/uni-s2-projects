import { useCallback } from 'react';
import { useReactFlow, NodeResizeControl } from '@xyflow/react';
import type { ResizeParams } from '@xyflow/react';

interface NodeResizerProps {
  nodeId: string;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export function NodeResizer({
  nodeId,
  minWidth = 50,
  minHeight = 50,
  maxWidth,
  maxHeight,
}: NodeResizerProps) {
  const { getNode, updateNode } = useReactFlow();

  const handleResize = useCallback(
    (_event: any, params: ResizeParams) => {
      const node = getNode(nodeId);
      if (node && params.width && params.height) {
        updateNode(nodeId, {
          width: params.width,
          height: params.height,
          data: {
            ...node.data,
            width: params.width,
            height: params.height,
          },
        });
      }
    },
    [nodeId, getNode, updateNode]
  );

  return (
    <NodeResizeControl
      style={{
        background: 'transparent',
        border: 'none',
      }}
      minWidth={minWidth}
      minHeight={minHeight}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      onResize={handleResize}
    />
  );
}

