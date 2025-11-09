/**
 * Rectangle Tool Component
 * 
 * Tool for drawing rectangles on the whiteboard by clicking and dragging.
 * Creates rectangle nodes when drawing is completed.
 * 
 * @module whiteboard/components/tools/RectangleTool
 */

import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { useReactFlow } from '@xyflow/react';

/**
 * Props for RectangleTool component
 */
interface RectangleToolProps {
  /** Callback when rectangle drawing is completed */
  onComplete?: (node: { id: string; position: { x: number; y: number }; width: number; height: number }) => void;
}

/**
 * Minimum size for a valid rectangle (prevents creating tiny rectangles)
 */
const MIN_RECTANGLE_SIZE = 10;

/**
 * Rectangle Tool Component
 * 
 * Allows users to draw rectangles on the whiteboard by clicking and dragging.
 * Shows a preview rectangle while drawing.
 * Creates a rectangle node when mouse is released.
 * 
 * Performance optimizations:
 * - Uses refs to track drawing state without re-renders
 * - Memoizes coordinate calculations
 * - Prevents event propagation to avoid conflicts with React Flow
 * 
 * @param props - Component props
 * @returns Rectangle tool overlay
 * 
 * @example
 * ```tsx
 * <RectangleTool
 *   onComplete={(node) => {
 *     createRectangleNode(node);
 *   }}
 * />
 * ```
 */
export function RectangleTool({ onComplete }: RectangleToolProps) {
  const { screenToFlowPosition, flowToScreenPosition } = useReactFlow();
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null);
  const isDrawingRef = useRef(false);

  /**
   * Handle mouse down - start drawing rectangle
   * 
   * @param e - Mouse event
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only left mouse button
      e.preventDefault();
      e.stopPropagation();
      
      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      setStartPos(position);
      setCurrentPos(position);
      isDrawingRef.current = true;
    },
    [screenToFlowPosition]
  );

  /**
   * Handle mouse move - update rectangle preview
   * 
   * @param e - Mouse event
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDrawingRef.current || !startPos) return;

      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      setCurrentPos(position);
    },
    [screenToFlowPosition, startPos]
  );

  /**
   * Handle mouse up - complete rectangle drawing
   */
  const handleMouseUp = useCallback(() => {
    if (!isDrawingRef.current || !startPos || !currentPos) return;

    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);

    // Only create rectangle if it has minimum size
    if (width > MIN_RECTANGLE_SIZE && height > MIN_RECTANGLE_SIZE && onComplete) {
      onComplete({
        id: `rectangle-${Date.now()}`,
        position: { x, y },
        width,
        height,
      });
    }

    setStartPos(null);
    setCurrentPos(null);
    isDrawingRef.current = false;
  }, [startPos, currentPos, onComplete]);

  // Set up global mouse event listeners when drawing starts
  useEffect(() => {
    if (!startPos) return;

    const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();
    const handleGlobalMouseLeave = () => handleMouseUp();

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mouseleave', handleGlobalMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mouseleave', handleGlobalMouseLeave);
    };
  }, [startPos, handleMouseMove, handleMouseUp]);

  /**
   * Calculate rectangle bounds in flow coordinates
   * Memoized to avoid recalculation on every render
   */
  const rect = useMemo(() => {
    if (!startPos || !currentPos) return null;
    
    return {
      x: Math.min(startPos.x, currentPos.x),
      y: Math.min(startPos.y, currentPos.y),
      width: Math.abs(currentPos.x - startPos.x),
      height: Math.abs(currentPos.y - startPos.y),
    };
  }, [startPos, currentPos]);

  /**
   * Convert flow coordinates to screen coordinates for rendering
   * Memoized to avoid recalculation on every render
   */
  const screenRect = useMemo(() => {
    if (!rect) return null;
    
    const topLeft = flowToScreenPosition({ x: rect.x, y: rect.y });
    const bottomRight = flowToScreenPosition({ x: rect.x + rect.width, y: rect.y + rect.height });
    
    return {
      x: Math.min(topLeft.x, bottomRight.x),
      y: Math.min(topLeft.y, bottomRight.y),
      width: Math.abs(bottomRight.x - topLeft.x),
      height: Math.abs(bottomRight.y - topLeft.y),
    };
  }, [rect, flowToScreenPosition]);

  return (
    <>
      {/* Invisible overlay for mouse events */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          cursor: 'crosshair',
          zIndex: 10,
        }}
      />
      {/* Rectangle preview */}
      {screenRect && screenRect.width > 0 && screenRect.height > 0 && (
        <div
          style={{
            position: 'absolute',
            left: `${screenRect.x}px`,
            top: `${screenRect.y}px`,
            width: `${screenRect.width}px`,
            height: `${screenRect.height}px`,
            border: '2px dashed #3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        />
      )}
    </>
  );
}
