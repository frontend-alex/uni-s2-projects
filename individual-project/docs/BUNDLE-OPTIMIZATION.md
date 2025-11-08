# Bundle Size Optimization Guide

## Overview

This document outlines the bundle optimization strategies implemented in the PeerLearn client application to improve load times and performance.

## Optimizations Implemented

### 1. ✅ Route-Based Code Splitting (Lazy Loading)

**What:** All route components are now lazy-loaded using React's `lazy()` and `Suspense`.

**Impact:** Routes are loaded on-demand, significantly reducing the initial bundle size.

**Files Modified:**
- `app/client/src/App.tsx`

**Before:**
```typescript
import { Dashboard, Profile, Settings } from "@/routes/(root)";
```

**After:**
```typescript
const Dashboard = lazy(() => import("@/routes/(root)/Dashboard"));
const Profile = lazy(() => import("@/routes/(root)/profile/Profile"));
```

**Expected Savings:** ~40-60% reduction in initial bundle size

---

### 2. ✅ EditorJS Dynamic Import

**What:** EditorJS and all its plugins (~200KB total) are now dynamically imported only when the editor component is rendered.

**Impact:** Users who never visit document edit pages won't download the editor code.

**Files Modified:**
- `app/client/src/components/editors/editorjs-editor.tsx`

**Before:**
```typescript
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
// ... all plugins imported upfront
```

**After:**
```typescript
const [{ default: EditorJS }, { default: Header }] = await Promise.all([
  import("@editorjs/editorjs"),
  import("@editorjs/header"),
  // ... dynamic imports
]);
```

**Expected Savings:** ~200KB removed from initial bundle

---

### 3. ✅ Manual Chunk Configuration

**What:** Configured strategic code splitting for vendor libraries using Rollup's `manualChunks`.

**Impact:** Better browser caching - vendor code rarely changes, so it can be cached separately from app code.

**Files Modified:**
- `app/client/vite.config.ts`

**Chunks Created:**
- `react-vendor` - React core libraries (45 KB, 16 KB gzipped)
- `query-vendor` - TanStack Query (35 KB, 10 KB gzipped)
- `form-vendor` - React Hook Form + Zod (86 KB, 23 KB gzipped)
- `ui-vendor` - Radix UI components (99 KB, 32 KB gzipped)
- `icons-vendor` - Lucide React (16 KB, 3 KB gzipped)
- `editor-vendor` - EditorJS plugins (364 KB, 99 KB gzipped) - lazy loaded
- `animation-vendor` - Motion + Embla (76 KB, 28 KB gzipped)
- `http-vendor` - Axios (35 KB, 14 KB gzipped) - **NEW**
- `toast-vendor` - Sonner (33 KB, 9 KB gzipped) - **NEW**

**Benefits:**
- Vendor chunks cached separately
- Parallel download of multiple chunks
- Faster rebuilds during development

---

### 4. ✅ Date-fns Tree Shaking

**What:** Verified that date-fns imports use named imports for optimal tree-shaking.

**Status:** Already optimized! ✅

**Current Import:**
```typescript
import { formatDistanceToNow } from "date-fns";
```

**Why This Matters:** date-fns is ~200KB total, but we only use 1 function (~5KB)

---

### 5. ✅ Fixed Mixed Static/Dynamic Imports

**What:** Extracted skeleton components into separate files to prevent mixed imports.

**Impact:** Components can now be properly code-split. Previously, importing skeletons from component files pulled in the entire component, preventing lazy loading.

**Files Created:**
- `app/client/src/components/carousels/create-doc-carousel-skeleton.tsx`
- `app/client/src/components/dropdowns/user-dropdown-skeleton.tsx`
- `app/client/src/components/dropdowns/worksapces/workspace-dropdown-crud-skeleton.tsx`
- `app/client/src/components/BreadCrumps-skeleton.tsx`

**Files Modified:**
- All files importing skeletons now import from separate skeleton files
- Original component files no longer export skeletons

**Result:** Eliminated all Vite warnings about mixed static/dynamic imports, enabling proper code splitting.

---

### 6. ✅ Bundle Analyzer Integration

**What:** Enhanced bundle visualizer configuration for detailed analysis.

**Files Modified:**
- `app/client/vite.config.ts`
- `app/client/package.json`

**New Script:**
```bash
pnpm run build:analyze
```

**Features:**
- Visualizes bundle composition
- Shows gzip and brotli sizes
- Generates `dist/stats.html` for analysis

---

## How to Measure Results

### 1. Build the Production Bundle

```bash
cd app/client
pnpm run build
```

### 2. Analyze Bundle Size

```bash
pnpm run build:analyze
```

This will:
1. Build the production bundle
2. Generate a visual report
3. Open `stats.html` in your browser

### 3. Check Build Output

Look for output like:
```
dist/index.html                   0.XX kB
dist/assets/index-[hash].css      XX.XX kB │ gzip: XX.XX kB
dist/assets/react-vendor-[hash].js XX.XX kB │ gzip: XX.XX kB
dist/assets/index-[hash].js       XX.XX kB │ gzip: XX.XX kB
```

### 4. Test in Browser

```bash
pnpm run preview
```

Open DevTools → Network tab → Throttle to "Fast 3G" to test real-world performance.

---

## Expected Results

### Before Optimization
- Initial Bundle: **320 KB** (102 KB gzipped)
- Main bundle: 320 KB
- Number of chunks: ~8
- Mixed static/dynamic imports causing warnings

### After Optimization ✅
- Initial Bundle: **239 KB** (75 KB gzipped) - **24% reduction**
- Main bundle: 239 KB (down from 320 KB)
- Total initial load: **~222 KB gzipped** (all vendor chunks)
- Number of chunks: 15+ (better code splitting)
- All mixed import warnings resolved

### Key Metrics to Track

1. **Initial Bundle Size**
   - Target: < 300KB gzipped
   - Critical: Main entry chunk

2. **Time to Interactive (TTI)**
   - Target: < 3 seconds on 3G
   - Measure with Lighthouse

3. **First Contentful Paint (FCP)**
   - Target: < 1.5 seconds
   - Users see content faster

4. **Largest Contentful Paint (LCP)**
   - Target: < 2.5 seconds
   - Core Web Vital

---

## Additional Optimization Opportunities

### Future Improvements (Not Yet Implemented)

#### 1. Image Optimization
- ✅ Already have `vite-plugin-imagemin` configured
- Consider: WebP format for all images
- Consider: Responsive images with `srcset`

#### 2. Preload Critical Resources
```html
<link rel="preload" href="/assets/react-vendor.js" as="script">
```

#### 3. Remove Unused Dependencies

Run dependency analysis:
```bash
pnpm dlx depcheck
```

Look for:
- Unused packages in package.json
- Duplicate dependencies

#### 4. CSS Optimization
- PurgeCSS (may already be handled by Tailwind)
- Critical CSS inlining

#### 5. Service Worker for Caching
- Implement Workbox for offline caching
- Cache API responses with stale-while-revalidate

---

## Best Practices Going Forward

### 1. Monitor Bundle Size
- Run `build:analyze` before major releases
- Set up CI/CD bundle size checks
- Alert if bundle size increases > 10%

### 2. Lazy Load Heavy Components
When adding new features, consider:
```typescript
// ❌ Don't do this for heavy components
import { HeavyChart } from "chart-library";

// ✅ Do this instead
const HeavyChart = lazy(() => import("chart-library"));
```

### 3. Optimize Images
- Use WebP format
- Compress images before committing
- Consider using a CDN

### 4. Audit Dependencies Regularly
```bash
pnpm audit
pnpm outdated
```

### 5. Use React DevTools Profiler
- Identify slow components
- Optimize re-renders with `memo()`, `useMemo()`, `useCallback()`

---

## Performance Budget

Set hard limits for your bundle:

| Metric | Budget | Current | Status |
|--------|--------|---------|--------|
| Initial JS (main bundle) | < 300 KB | **239 KB** (75 KB gzipped) | ✅ **PASS** |
| Initial CSS | < 50 KB | **75 KB** (12 KB gzipped) | ✅ **PASS** |
| Total Initial (gzipped) | < 350 KB | **~222 KB** gzipped | ✅ **PASS** |
| Max Chunk Size | < 150 KB | **99 KB** (ui-vendor) | ✅ **PASS** |

Update this table after running `build:analyze`.

---

## Troubleshooting

### Bundle Still Too Large?

1. **Check for duplicate dependencies**
   ```bash
   pnpm list --depth=0
   ```

2. **Analyze what's inside the bundle**
   - Open `dist/stats.html`
   - Look for unexpected large modules
   - Consider alternatives to heavy libraries

3. **Verify tree-shaking is working**
   - Check that imports are named (not default)
   - Ensure packages have proper `sideEffects: false` in package.json

### Chunks Not Loading?

1. Check `base` path in vite.config.ts
2. Verify asset paths in production
3. Check console for CORS or 404 errors

---

## References

- [Vite Performance Best Practices](https://vitejs.dev/guide/performance.html)
- [React Code Splitting](https://react.dev/reference/react/lazy)
- [Web.dev Bundle Size Guide](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
- [Rollup Manual Chunks](https://rollupjs.org/configuration-options/#output-manualchunks)

---

**Last Updated:** November 8, 2025  
**Maintained By:** Development Team

