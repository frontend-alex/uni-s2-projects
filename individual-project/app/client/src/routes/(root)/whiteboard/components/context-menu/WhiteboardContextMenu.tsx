import { useCallback, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuLabel,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Square,
  Circle,
  Type,
  Image,
  Diamond,
  Copy,
  Trash2,
  Link,
  Layers,
  Lock,
  Unlock,
} from 'lucide-react';

interface WhiteboardContextMenuProps {
  children: React.ReactNode;
  onAddNode?: (type: string, position: { x: number; y: number }) => void;
  selectedNodes?: Node[];
  selectedEdges?: Edge[];
  onDelete?: (nodes: Node[], edges: Edge[]) => void;
  onDuplicate?: (nodes: Node[]) => void;
  onLock?: (nodes: Node[]) => void;
  onUnlock?: (nodes: Node[]) => void;
  edgeType?: string;
  onEdgeTypeChange?: (type: string) => void;
  showGrid?: boolean;
  onGridToggle?: (show: boolean) => void;
  showMinimap?: boolean;
  onMinimapToggle?: (show: boolean) => void;
  isRectangleMode?: boolean;
  onRectangleModeToggle?: (enabled: boolean) => void;
}

export function WhiteboardContextMenu({
  children,
  onAddNode,
  selectedNodes = [],
  selectedEdges = [],
  onDelete,
  onDuplicate,
  onLock,
  onUnlock,
  edgeType = 'default',
  onEdgeTypeChange,
  showGrid = true,
  onGridToggle,
  showMinimap = true,
  onMinimapToggle,
  isRectangleMode = false,
  onRectangleModeToggle,
}: WhiteboardContextMenuProps) {
  const { screenToFlowPosition } = useReactFlow();
  const hasSelection = selectedNodes.length > 0 || selectedEdges.length > 0;
  const rightClickPositionRef = useRef<{ x: number; y: number } | null>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // Store the click position for node placement
    rightClickPositionRef.current = { x: e.clientX, y: e.clientY };
    // Don't prevent default - let the context menu show
  }, []);

  const handleAddNode = useCallback(
    (type: string, e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (onAddNode && rightClickPositionRef.current) {
        const position = screenToFlowPosition({
          x: rightClickPositionRef.current.x,
          y: rightClickPositionRef.current.y,
        });
        onAddNode(type, position);
        rightClickPositionRef.current = null;
      }
      // Close context menu by clicking outside
      setTimeout(() => {
        document.body.click();
      }, 0);
    },
    [onAddNode, screenToFlowPosition]
  );

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(selectedNodes, selectedEdges);
    }
    // Close context menu
    setTimeout(() => {
      document.body.click();
    }, 0);
  }, [onDelete, selectedNodes, selectedEdges]);

  const handleDuplicate = useCallback(() => {
    if (onDuplicate && selectedNodes.length > 0) {
      onDuplicate(selectedNodes);
    }
    // Close context menu
    setTimeout(() => {
      document.body.click();
    }, 0);
  }, [onDuplicate, selectedNodes]);

  const handleLock = useCallback(() => {
    if (onLock && selectedNodes.length > 0) {
      onLock(selectedNodes);
    }
    // Close context menu
    setTimeout(() => {
      document.body.click();
    }, 0);
  }, [onLock, selectedNodes]);

  const handleUnlock = useCallback(() => {
    if (onUnlock && selectedNodes.length > 0) {
      onUnlock(selectedNodes);
    }
    // Close context menu
    setTimeout(() => {
      document.body.click();
    }, 0);
  }, [onUnlock, selectedNodes]);

  return (
    <ContextMenu>
      <div onContextMenu={handleContextMenu} className="w-full h-full">
        <ContextMenuTrigger asChild>
          {children}
        </ContextMenuTrigger>
      </div>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>Add Node</ContextMenuLabel>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Square className="w-4 h-4" />
            Shapes
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem
              onClick={(e) => handleAddNode('rectangle', e)}
            >
              <Square className="w-4 h-4" />
              Rectangle
            </ContextMenuItem>
            <ContextMenuItem
              onClick={(e) => handleAddNode('circle', e)}
            >
              <Circle className="w-4 h-4" />
              Circle
            </ContextMenuItem>
            <ContextMenuItem
              onClick={(e) => handleAddNode('diamond', e)}
            >
              <Diamond className="w-4 h-4" />
              Diamond
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuItem
          onClick={(e) => handleAddNode('text', e)}
        >
          <Type className="w-4 h-4" />
          Text
        </ContextMenuItem>

        <ContextMenuItem
          onClick={(e) => handleAddNode('image', e)}
        >
          <Image className="w-4 h-4" />
          Image
        </ContextMenuItem>

        <ContextMenuItem
          onClick={(e) => handleAddNode('default', e)}
        >
          <Layers className="w-4 h-4" />
          Default Node
        </ContextMenuItem>

        {hasSelection && (
          <>
            <ContextMenuSeparator />
            <ContextMenuLabel>Selection</ContextMenuLabel>
            <ContextMenuItem onClick={handleDuplicate}>
              <Copy className="w-4 h-4" />
              Duplicate
            </ContextMenuItem>
            <ContextMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="w-4 h-4" />
              Delete
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={selectedNodes.some((n) => n.draggable === false) ? handleUnlock : handleLock}
            >
              {selectedNodes.some((n) => n.draggable === false) ? (
                <>
                  <Unlock className="w-4 h-4" />
                  Unlock
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Lock
                </>
              )}
            </ContextMenuItem>
          </>
        )}

        <ContextMenuSeparator />
        <ContextMenuLabel>Edge Type</ContextMenuLabel>
        <ContextMenuRadioGroup
          value={edgeType}
          onValueChange={(value) => {
            if (onEdgeTypeChange) {
              onEdgeTypeChange(value);
            }
            // Close context menu
            setTimeout(() => {
              document.body.click();
            }, 0);
          }}
        >
          <ContextMenuRadioItem value="default">
            Default
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="straight">
            Straight
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="step">
            Step
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="smoothstep">
            Smooth Step
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="bezier">
            Bezier
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>

        <ContextMenuSeparator />
        <ContextMenuLabel>Tools</ContextMenuLabel>
        <ContextMenuCheckboxItem
          className='gap-3 flex items-center justify-start px-2'
          checked={isRectangleMode}
          onCheckedChange={(checked) => {
            if (onRectangleModeToggle) {
              onRectangleModeToggle(checked);
            }
            // Close context menu
            setTimeout(() => {
              document.body.click();
            }, 0);
          }}
        >
          <Square className="w-4 h-4" />
          Rectangle Mode
        </ContextMenuCheckboxItem>

        <ContextMenuSeparator />
        <ContextMenuLabel>View</ContextMenuLabel>
        <ContextMenuCheckboxItem
          checked={showGrid}
          onCheckedChange={(checked) => {
            if (onGridToggle) {
              onGridToggle(checked);
            }
            // Close context menu
            setTimeout(() => {
              document.body.click();
            }, 0);
          }}
        >
          Show Grid
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={showMinimap}
          onCheckedChange={(checked) => {
            if (onMinimapToggle) {
              onMinimapToggle(checked);
            }
            // Close context menu
            setTimeout(() => {
              document.body.click();
            }, 0);
          }}
        >
          Show Minimap
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

