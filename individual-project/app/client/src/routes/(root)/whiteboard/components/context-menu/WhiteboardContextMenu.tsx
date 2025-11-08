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
    (type: string) => {
      if (onAddNode && rightClickPositionRef.current) {
        const position = screenToFlowPosition({
          x: rightClickPositionRef.current.x,
          y: rightClickPositionRef.current.y,
        });
        onAddNode(type, position);
        rightClickPositionRef.current = null;
      }
    },
    [onAddNode, screenToFlowPosition]
  );

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(selectedNodes, selectedEdges);
    }
  }, [onDelete, selectedNodes, selectedEdges]);

  const handleDuplicate = useCallback(() => {
    if (onDuplicate && selectedNodes.length > 0) {
      onDuplicate(selectedNodes);
    }
  }, [onDuplicate, selectedNodes]);

  const handleLock = useCallback(() => {
    if (onLock && selectedNodes.length > 0) {
      onLock(selectedNodes);
    }
  }, [onLock, selectedNodes]);

  const handleUnlock = useCallback(() => {
    if (onUnlock && selectedNodes.length > 0) {
      onUnlock(selectedNodes);
    }
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
              onClick={(e) => {
                e.preventDefault();
                handleAddNode('rectangle');
              }}
            >
              <Square className="w-4 h-4" />
              Rectangle
            </ContextMenuItem>
            <ContextMenuItem
              onClick={(e) => {
                e.preventDefault();
                handleAddNode('circle');
              }}
            >
              <Circle className="w-4 h-4" />
              Circle
            </ContextMenuItem>
            <ContextMenuItem
              onClick={(e) => {
                e.preventDefault();
                handleAddNode('diamond');
              }}
            >
              <Diamond className="w-4 h-4" />
              Diamond
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuItem
          onClick={(e) => {
            e.preventDefault();
            handleAddNode('text');
          }}
        >
          <Type className="w-4 h-4" />
          Text
        </ContextMenuItem>

        <ContextMenuItem
          onClick={(e) => {
            e.preventDefault();
            handleAddNode('image');
          }}
        >
          <Image className="w-4 h-4" />
          Image
        </ContextMenuItem>

        <ContextMenuItem
          onClick={(e) => {
            e.preventDefault();
            handleAddNode('default');
          }}
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
          onValueChange={onEdgeTypeChange}
        >
          <ContextMenuRadioItem value="default">
            <Link className="w-4 h-4" />
            Default
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="straight">
            <Link className="w-4 h-4" />
            Straight
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="step">
            <Link className="w-4 h-4" />
            Step
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="smoothstep">
            <Link className="w-4 h-4" />
            Smooth Step
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="bezier">
            <Link className="w-4 h-4" />
            Bezier
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>

        <ContextMenuSeparator />
        <ContextMenuLabel>Tools</ContextMenuLabel>
        <ContextMenuCheckboxItem
          className='gap-3 flex items-center justify-start px-2'
          checked={isRectangleMode}
          onCheckedChange={onRectangleModeToggle}
        >
          <Square className="w-4 h-4" />
          Rectangle Mode
        </ContextMenuCheckboxItem>

        <ContextMenuSeparator />
        <ContextMenuLabel>View</ContextMenuLabel>
        <ContextMenuCheckboxItem
          checked={showGrid}
          onCheckedChange={onGridToggle}
        >
          Show Grid
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={showMinimap}
          onCheckedChange={onMinimapToggle}
        >
          Show Minimap
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

