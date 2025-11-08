import { useCallback, useRef, useState, useEffect } from 'react';
import { useReactFlow, Panel } from '@xyflow/react';

interface RectangleToolProps {
  onComplete?: (node: { id: string; position: { x: number; y: number }; width: number; height: number }) => void;
}

export function RectangleTool({ onComplete }: RectangleToolProps) {
  const { screenToFlowPosition, flowToScreenPosition } = useReactFlow();
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null);
  const isDrawingRef = useRef(false);

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

  const handleMouseUp = useCallback(() => {
    if (!isDrawingRef.current || !startPos || !currentPos) return;

    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);

    // Only create rectangle if it has minimum size
    if (width > 10 && height > 10 && onComplete) {
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

  // Calculate rectangle bounds for preview
  const rect = startPos && currentPos
    ? {
        x: Math.min(startPos.x, currentPos.x),
        y: Math.min(startPos.y, currentPos.y),
        width: Math.abs(currentPos.x - startPos.x),
        height: Math.abs(currentPos.y - startPos.y),
      }
    : null;

  // Convert flow coordinates to screen coordinates for rendering
  const screenRect = rect ? (() => {
    const topLeft = flowToScreenPosition({ x: rect.x, y: rect.y });
    const bottomRight = flowToScreenPosition({ x: rect.x + rect.width, y: rect.y + rect.height });
    return {
      x: Math.min(topLeft.x, bottomRight.x),
      y: Math.min(topLeft.y, bottomRight.y),
      width: Math.abs(bottomRight.x - topLeft.x),
      height: Math.abs(bottomRight.y - topLeft.y),
    };
  })() : null;

  return (
    <>
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
