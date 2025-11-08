import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteImagemin from "vite-plugin-imagemin";
import viteCompression from "vite-plugin-compression";

import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
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
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - separate large libraries
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "query-vendor": ["@tanstack/react-query"],
          "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-avatar",
            "@radix-ui/react-label",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-accordion",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-toggle",
            "@radix-ui/react-toggle-group",
          ],
          "icons-vendor": ["lucide-react"],
          "editor-vendor": [
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
          "animation-vendor": ["motion", "embla-carousel-react"],
          "http-vendor": ["axios"],
          "toast-vendor": ["sonner"],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "react-hook-form",
      "zod",
    ],
  },
});
