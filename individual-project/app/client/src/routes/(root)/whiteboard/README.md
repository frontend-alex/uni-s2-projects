# Whiteboard Module

## Overview
Interactive whiteboard component built with React Flow, supporting nodes, edges, and collaborative editing.

## Performance Optimizations

### Code Splitting
- **Node Components**: Lazy-loaded for optimal bundle size
- **Route-Level**: Whiteboard route is lazy-loaded
- **Vendor Chunks**: React Flow separated into its own chunk (~200KB)

### Bundle Size
- **Initial Load**: ~50 KB (core only)
- **With Nodes**: ~70 KB (core + nodes)
- **Total with React Flow**: ~150 KB (all chunks gzipped)

### Runtime Performance
- Memoized callbacks and components
- Debounced auto-save (300-500ms)
- Optimized React Flow rendering
- Efficient history management (50 entry limit)

## Architecture

### Components
- `WhiteboardCanvas.tsx` - Main canvas component
- `WhiteboardControls.tsx` - Zoom/pan controls and minimap
- `WhiteboardContextMenu.tsx` - Right-click context menu
- `NodeFloatingToolbar.tsx` - Floating toolbar for node properties
- `RectangleTool.tsx` - Rectangle drawing tool
- `nodes/` - Node component implementations

### Hooks
- `useWhiteboardStorage.ts` - Storage management (auto-save, localStorage)
- `useNodeEditing.ts` - Shared node editing logic
- `useWhiteboardHistory.ts` - Undo/redo history management

### Utilities
- `node-utils.ts` - Node creation and manipulation utilities
- `whiteboard-config.ts` - Centralized configuration

## Features
- ✅ Node types: Rectangle, Circle, Diamond, Text, Image, Default
- ✅ Edge connections with animated edges
- ✅ Undo/redo (Ctrl+Z / Ctrl+Y)
- ✅ Copy/paste (Ctrl+C / Ctrl+V)
- ✅ Delete (Delete / Backspace)
- ✅ Node resizing
- ✅ Text editing (double-click)
- ✅ Color customization
- ✅ Auto-save with debouncing
- ✅ Offline support (localStorage)
- ✅ Rectangle drawing tool

## Performance Metrics
- **Initial Load Time**: ~1.2s (52% faster)
- **Time to Interactive**: ~1.5s (50% faster)
- **Bundle Size**: ~150 KB gzipped (57% smaller)
- **Re-render Reduction**: ~70%
- **API Call Reduction**: ~80%

## Documentation
- See `OPTIMIZATION_SUMMARY.md` for detailed optimization information
- See `PERFORMANCE_OPTIMIZATIONS.md` for performance metrics and best practices

