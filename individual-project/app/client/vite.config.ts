import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteImagemin from "vite-plugin-imagemin";
import viteCompression from "vite-plugin-compression";

import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react({
      // Optimize React for production
      jsxRuntime: 'automatic',
    }),
    tailwindcss(),
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 1024,
      deleteOriginFile: false,
    }),
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 1024,
      deleteOriginFile: false,
    }),
    visualizer({
      open: false, // Don't auto-open during dev
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
    viteImagemin({
      webp: {
        quality: 80,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable sourcemaps only in development or for debugging
    sourcemap: process.env.NODE_ENV === 'development',
    // Optimize chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Use esbuild for faster builds (terser is slower but smaller, use if needed)
    minify: 'esbuild',
    // Ensure proper common chunk extraction for shared dependencies
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        // Optimize chunk naming for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        // Configure manual chunk splitting
        // IMPORTANT: React must be in its own chunk and loaded first
        // This ensures all other chunks can properly import React
        manualChunks: (id) => {
          // React vendor chunk - MUST come first so other chunks can depend on it
          // This ensures React is available to all chunks that need it
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          
          // React Flow - large library, separate chunk (important for whiteboard performance)
          // This is ~200KB, so separating it helps with caching
          if (id.includes('@xyflow/react')) {
            return 'reactflow-vendor';
          }
          
          // React Query
          if (id.includes('@tanstack/react-query')) {
            return 'query-vendor';
          }
          
          // Form libraries
          if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('node_modules/zod')) {
            return 'form-vendor';
          }
          
          // Radix UI components - keep ALL Radix UI together in one chunk
          // Vite will automatically create proper imports to react-vendor chunk
          // The namespace import (import * as React) should work correctly with proper chunk dependencies
          if (id.includes('@radix-ui')) {
            return 'radix-ui-vendor';
          }
          
          // Editor.js - only used in document editor, separate chunk
          if (id.includes('@editorjs')) {
            return 'editor-vendor';
          }
          
          // Icons - large library, separate chunk
          if (id.includes('lucide-react')) {
            return 'icons-vendor';
          }
          
          // Animation libraries
          if (id.includes('motion') || id.includes('embla-carousel-react')) {
            return 'animation-vendor';
          }
          
          // HTTP client
          if (id.includes('axios')) {
            return 'http-vendor';
          }
          
          // Toast notifications
          if (id.includes('sonner')) {
            return 'toast-vendor';
          }
          
          // Whiteboard specific code - separate chunk for better code splitting
          if (id.includes('/whiteboard/')) {
            // Node components - lazy loaded separately for optimal performance
            if (id.includes('/nodes/')) {
              return 'whiteboard-nodes';
            }
            // Other whiteboard code (canvas, tools, hooks, utils)
            return 'whiteboard-core';
          }
        },
      },
    },
    // Optimize chunking strategy
    target: 'esnext',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Report compressed sizes
    reportCompressedSize: true,
  },
  optimizeDeps: {
    // Pre-bundle these dependencies for faster dev server startup
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "react-hook-form",
      "zod",
      "@xyflow/react", // Pre-bundle React Flow for faster loading
      // Ensure Radix UI components can access React properly
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-slot",
    ],
    // Exclude large dependencies from pre-bundling (let them be lazy loaded)
    exclude: [
      // Editor.js is only used in document editor, don't pre-bundle
      "@editorjs/editorjs",
      "@editorjs/header",
      "@editorjs/list",
      "@editorjs/paragraph",
      "@editorjs/quote",
      "@editorjs/code",
      "@editorjs/link",
      "@editorjs/marker",
      "@editorjs/underline",
    ],
    // Optimize esbuild options for dependencies
    esbuildOptions: {
      target: 'esnext',
    },
  },
  // Performance optimizations
  server: {
    // Optimize HMR
    hmr: {
      overlay: true,
    },
  },
  // Esbuild options for production builds
  esbuild: {
    // drop: ['console', 'debugger'], // Remove console and debugger in production
    legalComments: 'none', // Remove comments
  },
  // Enable CSS code splitting
  css: {
    devSourcemap: true,
  },
});
