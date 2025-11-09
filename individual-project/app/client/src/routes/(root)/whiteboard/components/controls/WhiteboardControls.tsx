/**
 * Whiteboard Controls Component
 * 
 * Provides React Flow controls for the whiteboard, including:
 * - Background grid (optional)
 * - Zoom/pan controls
 * - Minimap (optional)
 * 
 * @module whiteboard/components/controls/WhiteboardControls
 */

import { Controls, Background, MiniMap, BackgroundVariant } from '@xyflow/react';

/**
 * Props for WhiteboardControls component
 */
interface WhiteboardControlsProps {
  /** Whether to show the minimap (default: true) */
  showMiniMap?: boolean;
  /** Whether to show the background grid (default: true) */
  showBackground?: boolean;
}

/**
 * Whiteboard Controls Component
 * 
 * Renders React Flow controls including background, zoom controls, and minimap.
 * 
 * @param props - Component props
 * @returns Whiteboard controls
 * 
 * @example
 * ```tsx
 * <WhiteboardControls
 *   showMiniMap={true}
 *   showBackground={true}
 * />
 * ```
 */
export function WhiteboardControls({
  showMiniMap = true,
  showBackground = true,
}: WhiteboardControlsProps) {
  return (
    <>
      {/* Background grid pattern */}
      {showBackground && (
        <Background
          gap={16}
          size={1}
          variant={BackgroundVariant.Dots}
        />
      )}
      
      {/* Zoom and pan controls */}
      <Controls
        className="bg-background border rounded-lg shadow-lg"
      />

      {/* Minimap for navigation */}
      {showMiniMap && (
        <MiniMap
          nodeColor={(node) => {
            if (node.selected) return '#3b82f6';
            return '#94a3b8';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="bg-background border rounded-lg shadow-lg"
        />
      )}
    </>
  );
}

