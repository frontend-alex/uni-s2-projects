import { useEffect, useState, useCallback } from "react";
import { useReactFlow, type Node, useStore } from "@xyflow/react";
import { randomColorsDark } from "@/consts/consts";
import type {
  RectangleNodeData,
  CircleNodeData,
  DiamondNodeData,
} from "./nodes";
import { WHITEBOARD_CONFIG } from "../config/whiteboard-config";

interface NodeFloatingToolbarProps {
  selectedNodes: Node[];
  onUpdateNode: (nodeId: string, data: any) => void;
}

// Take colors from the palette based on config
const COLOR_PALETTE = randomColorsDark.slice(0, WHITEBOARD_CONFIG.toolbar.colorPalette.count);

export function NodeFloatingToolbar({
  selectedNodes,
  onUpdateNode,
}: NodeFloatingToolbarProps) {
  const { getNode, flowToScreenPosition } = useReactFlow();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Subscribe to viewport transform and node positions for reactive updates
  const transform = useStore((store) => store.transform);
  const nodes = useStore((store) => store.nodeLookup);

  // Update position when node or viewport changes
  useEffect(() => {
    if (selectedNodes.length === 1) {
      const updatePosition = () => {
        const node = selectedNodes[0];
        // Find the actual DOM element for this node (React Flow wraps nodes in .react-flow__node)
        const nodeDomElement = document.querySelector(`.react-flow__node[data-id="${node.id}"]`) as HTMLElement;
        
        if (nodeDomElement) {
          const rect = nodeDomElement.getBoundingClientRect();
          // Center the toolbar above the node
          setPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + WHITEBOARD_CONFIG.toolbar.position.offsetY, // Above the node
          });
        } else {
          // Fallback: use flow coordinates
          const nodeElement = getNode(node.id);
          if (nodeElement) {
            const nodeData = nodeElement.data as
              | RectangleNodeData
              | CircleNodeData
              | DiamondNodeData;
            const nodeWidth =
              (nodeData as RectangleNodeData).width ||
              (nodeData as CircleNodeData | DiamondNodeData).size ||
              150;

            const screenPos = flowToScreenPosition({
              x: nodeElement.position.x,
              y: nodeElement.position.y,
            });

            const reactFlowContainer = document.querySelector(".react-flow");
            if (reactFlowContainer) {
              const containerRect = reactFlowContainer.getBoundingClientRect();
              setPosition({
                x: containerRect.left + screenPos.x + nodeWidth / 2,
                y: containerRect.top + screenPos.y - 50,
              });
            }
          }
        }
      };

      updatePosition();

      // Update on viewport or node changes (reduced frequency)
      const interval = setInterval(updatePosition, 50);
      return () => clearInterval(interval);
    }
  }, [selectedNodes, nodes, transform, getNode, flowToScreenPosition]);

  if (selectedNodes.length === 0 || selectedNodes.length > 1) {
    return null;
  }

  const handleColorChange = useCallback(
    (color: string) => {
      selectedNodes.forEach((node) => {
        const currentData = node.data as
          | RectangleNodeData
          | CircleNodeData
          | DiamondNodeData;
        onUpdateNode(node.id, {
          ...currentData,
          color,
        });
      });
    },
    [selectedNodes, onUpdateNode]
  );

  const node = selectedNodes[0];
  const nodeData = node.data as
    | RectangleNodeData
    | CircleNodeData
    | DiamondNodeData;
  const currentColor = nodeData.color || "#ffffff";

  const fillColors = [...COLOR_PALETTE, "#ffffff"];

  return (
    <div
      className="fixed z-50 bg-background/95 backdrop-blur-sm border rounded-md shadow-lg p-1.5 flex items-center justify-center pointer-events-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -100%)",
        marginTop: "-8px",
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Fill Colors - centered row */}
      <div className="flex items-center gap-1">
        {fillColors.map((color) => (
          <button
            key={`fill-${color}`}
            onClick={() => handleColorChange(color)}
            className={`w-5 h-5 rounded border-2 transition-all hover:scale-125 cursor-pointer ${
              currentColor === color
                ? "border-foreground ring-1 ring-offset-1 ring-foreground/50"
                : "border-border/50 hover:border-border"
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}
