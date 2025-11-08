import { Controls, Background, MiniMap, Panel, BackgroundVariant } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Square } from 'lucide-react';

interface WhiteboardControlsProps {
  showMiniMap?: boolean;
  showBackground?: boolean;
  isRectangleMode?: boolean;
  onRectangleModeToggle?: (enabled: boolean) => void;
}

export function WhiteboardControls({
  showMiniMap = true,
  showBackground = true,
  isRectangleMode = false,
  onRectangleModeToggle,
}: WhiteboardControlsProps) {

  return (
    <>
      {showBackground && (
        <Background
          gap={16}
          size={1}
          variant={BackgroundVariant.Dots}
        />
      )}
      
      <Controls
        className="bg-background border rounded-lg shadow-lg"
      />

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

      {/*
      <Panel position="top-left" className="flex gap-2 flex-wrap">
        {onRectangleModeToggle && (
          <Button
            size="sm"
            variant={isRectangleMode ? "default" : "outline"}
            onClick={() => onRectangleModeToggle(!isRectangleMode)}
            title={isRectangleMode ? "Exit Rectangle Mode" : "Rectangle Mode"}
          >
            <Square className="w-4 h-4 mr-2" />
            {isRectangleMode ? "Exit Rectangle" : "Rectangle"}
          </Button>
        )}
      </Panel>
      */}
    </>
  );
}

