import { useState, useEffect } from 'react';
import { Panel } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Square, Circle, Diamond } from 'lucide-react';
import type { RectangleNodeData, CircleNodeData, DiamondNodeData } from './nodes';

interface NodePropertiesPanelProps {
  selectedNodes: Node[];
  onUpdateNode: (nodeId: string, data: any) => void;
}

export function NodePropertiesPanel({ selectedNodes, onUpdateNode }: NodePropertiesPanelProps) {
  const [label, setLabel] = useState('');
  const [fillColor, setFillColor] = useState('#ffffff');
  const [strokeColor, setStrokeColor] = useState('#d1d5db');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [width, setWidth] = useState(150);
  const [height, setHeight] = useState(100);

  useEffect(() => {
    if (selectedNodes.length === 1) {
      const node = selectedNodes[0];
      const data = node.data as RectangleNodeData | CircleNodeData | DiamondNodeData;
      
      setLabel(data.label || data.text || '');
      setFillColor(data.color || '#ffffff');
      setStrokeColor(data.strokeColor || '#d1d5db');
      setStrokeWidth(data.strokeWidth || 2);
      
      if (node.type === 'rectangle') {
        setWidth((data as RectangleNodeData).width || 150);
        setHeight((data as RectangleNodeData).height || 100);
      } else if (node.type === 'circle' || node.type === 'diamond') {
        const size = (data as CircleNodeData | DiamondNodeData).size || 100;
        setWidth(size);
        setHeight(size);
      }
    }
  }, [selectedNodes]);

  if (selectedNodes.length === 0) {
    return null;
  }

  const handleUpdate = () => {
    selectedNodes.forEach((node) => {
      const currentData = node.data as RectangleNodeData | CircleNodeData | DiamondNodeData;
      let updatedData: any = {
        ...currentData,
        color: fillColor,
        strokeColor,
        strokeWidth,
      };

      // Update label (or text for TextNode)
      if (node.type === 'text') {
        updatedData.text = label;
      } else {
        updatedData.label = label;
      }

      if (node.type === 'rectangle') {
        updatedData.width = width;
        updatedData.height = height;
        // Also update the node's width and height properties for React Flow
        onUpdateNode(node.id, { ...updatedData, width, height });
      } else if (node.type === 'circle' || node.type === 'diamond') {
        updatedData.size = width; // Use width for circles/diamonds
        onUpdateNode(node.id, updatedData);
      } else {
        onUpdateNode(node.id, updatedData);
      }
    });
  };

  const isRectangle = selectedNodes[0]?.type === 'rectangle';
  const isCircle = selectedNodes[0]?.type === 'circle';
  const isDiamond = selectedNodes[0]?.type === 'diamond';

  return (
    <Panel position="top-right" className="bg-background border rounded-lg shadow-lg p-4 min-w-[250px]">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          {isRectangle && <Square className="w-4 h-4" />}
          {isCircle && <Circle className="w-4 h-4" />}
          {isDiamond && <Diamond className="w-4 h-4" />}
          <h3 className="font-semibold">Properties</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Enter label..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fill-color">Fill Color</Label>
          <div className="flex gap-2">
            <Input
              id="fill-color"
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="w-16 h-8"
            />
            <Input
              type="text"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stroke-color">Stroke Color</Label>
          <div className="flex gap-2">
            <Input
              id="stroke-color"
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="w-16 h-8"
            />
            <Input
              type="text"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stroke-width">Stroke Width</Label>
          <Input
            id="stroke-width"
            type="number"
            min="1"
            max="10"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
          />
        </div>

        {isRectangle ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                min="50"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                min="50"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Input
              id="size"
              type="number"
              min="50"
              value={width}
              onChange={(e) => {
                const size = Number(e.target.value);
                setWidth(size);
                setHeight(size);
              }}
            />
          </div>
        )}

        <Button onClick={handleUpdate} className="w-full">
          Apply Changes
        </Button>
      </div>
    </Panel>
  );
}

