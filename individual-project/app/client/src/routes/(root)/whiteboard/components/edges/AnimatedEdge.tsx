/**
 * Animated Edge Component
 * 
 * Custom edge type with animated dashed stroke for visual feedback.
 * Used for edges in the whiteboard to indicate data flow or relationships.
 * 
 * @module whiteboard/components/edges/AnimatedEdge
 */

import { getBezierPath } from '@xyflow/react';
import { BaseEdge } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';

/**
 * Animated Edge Component
 * 
 * Renders an edge with an animated dashed stroke using CSS animations.
 * The animation creates a "flowing" effect along the edge path.
 * 
 * @param props - Edge props from React Flow
 * @returns Animated edge component
 * 
 * @example
 * ```tsx
 * <AnimatedEdge
 *   id="edge-1"
 *   sourceX={100}
 *   sourceY={100}
 *   targetX={200}
 *   targetY={200}
 *   markerEnd={{ type: MarkerType.ArrowClosed }}
 * />
 * ```
 */
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
  // Calculate Bezier path for the edge
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
      {/* Base edge (solid stroke) */}
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
      {/* Animated dashed overlay */}
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
      {/* CSS animation definition */}
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
