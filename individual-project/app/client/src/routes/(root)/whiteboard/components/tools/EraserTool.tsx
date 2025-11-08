import { useCallback, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';

interface EraserToolProps {
  enabled: boolean;
  onNodesDelete?: (nodes: Node[]) => void;
  onEdgesDelete?: (edges: Edge[]) => void;
}

export function useEraserTool({
  enabled,
  onNodesDelete,
  onEdgesDelete,
}: EraserToolProps) {
  const { getNodes, getEdges, screenToFlowPosition } = useReactFlow();
  const isErasingRef = useRef(false);
  const erasedNodesRef = useRef<Set<string>>(new Set());
  const erasedEdgesRef = useRef<Set<string>>(new Set());

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (!enabled) return;
      if (event.button !== 0) return; // Only left mouse button
      
      // Prevent default to avoid conflicts with ReactFlow
      event.stopPropagation();

      isErasingRef.current = true;
      erasedNodesRef.current.clear();
      erasedEdgesRef.current.clear();

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Find nodes/edges at position
      const nodes = getNodes();
      const edges = getEdges();

      nodes.forEach((node) => {
        const nodeWidth = (node.width as number) || node.measured?.width || 150;
        const nodeHeight = (node.height as number) || node.measured?.height || 100;
        if (
          position.x >= node.position.x &&
          position.x <= node.position.x + nodeWidth &&
          position.y >= node.position.y &&
          position.y <= node.position.y + nodeHeight
        ) {
          erasedNodesRef.current.add(node.id);
        }
      });

      edges.forEach((edge) => {
        // Simple edge intersection check
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);
        if (sourceNode && targetNode) {
          const midX = (sourceNode.position.x + targetNode.position.x) / 2;
          const midY = (sourceNode.position.y + targetNode.position.y) / 2;
          const distance = Math.sqrt(
            Math.pow(position.x - midX, 2) + Math.pow(position.y - midY, 2)
          );
          if (distance < 50) {
            erasedEdgesRef.current.add(edge.id);
          }
        }
      });
    },
    [enabled, screenToFlowPosition, getNodes, getEdges]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!enabled || !isErasingRef.current) return;
      
      // Prevent default to avoid conflicts with ReactFlow
      event.stopPropagation();

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nodes = getNodes();
      const edges = getEdges();

      nodes.forEach((node) => {
        const nodeWidth = (node.width as number) || node.measured?.width || 150;
        const nodeHeight = (node.height as number) || node.measured?.height || 100;
        if (
          position.x >= node.position.x &&
          position.x <= node.position.x + nodeWidth &&
          position.y >= node.position.y &&
          position.y <= node.position.y + nodeHeight
        ) {
          erasedNodesRef.current.add(node.id);
        }
      });

      edges.forEach((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);
        if (sourceNode && targetNode) {
          const midX = (sourceNode.position.x + targetNode.position.x) / 2;
          const midY = (sourceNode.position.y + targetNode.position.y) / 2;
          const distance = Math.sqrt(
            Math.pow(position.x - midX, 2) + Math.pow(position.y - midY, 2)
          );
          if (distance < 50) {
            erasedEdgesRef.current.add(edge.id);
          }
        }
      });
    },
    [enabled, screenToFlowPosition, getNodes, getEdges]
  );

  const handleMouseUp = useCallback(() => {
    if (!enabled || !isErasingRef.current) return;

    isErasingRef.current = false;

    const nodes = getNodes();
    const edges = getEdges();

    const nodesToDelete = nodes.filter((node) =>
      erasedNodesRef.current.has(node.id)
    );
    const edgesToDelete = edges.filter((edge) =>
      erasedEdgesRef.current.has(edge.id)
    );

    if (nodesToDelete.length > 0 && onNodesDelete) {
      onNodesDelete(nodesToDelete);
    }

    if (edgesToDelete.length > 0 && onEdgesDelete) {
      onEdgesDelete(edgesToDelete);
    }

    erasedNodesRef.current.clear();
    erasedEdgesRef.current.clear();
  }, [enabled, getNodes, getEdges, onNodesDelete, onEdgesDelete]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}

