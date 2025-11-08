import { getBezierPath } from '@xyflow/react';
import { BaseEdge } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';

export function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: '#3b82f6',
        }}
      />
      <path
        d={edgePath}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        className="animate-pulse"
        style={{
          strokeDasharray: '5,5',
          animation: 'dash 1s linear infinite',
        }}
      />
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -10;
          }
        }
      `}</style>
    </>
  );
}

