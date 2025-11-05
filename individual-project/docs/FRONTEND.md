## Frontend Documentation (React + Vite)

### Tech Stack

- React 19, TypeScript, Vite
- React Router 7.6
- TanStack Query 5 for data fetching/caching
- Tailwind CSS 4
- Radix UI primitives, lucide-react icons

### Application Boot

- `src/main.tsx`
  - Sets up QueryClientProvider, BrowserRouter, AuthProvider, ThemeProvider, and Toaster

### Routing and Guards

- `src/App.tsx` wires routes with guards
  - Public routes: landing, login, register, verify-email, forgot/reset password, auth callback
  - Authenticated routes: onboarding, app routes (board/:workspaceId, profile, settings, dashboard)
  - Guards
    - `LandingGuard` — optionally redirects authenticated users away from public landing
    - `AuthGuard` — ensures the user is logged out for public-only pages
    - `OnboardingGuard` — ensures logged-in users complete onboarding first
    - `AppGuard` — wraps authenticated application routes

- Paths centralized in `src/lib/router-paths.ts`

### Contexts and Providers

- `AuthContext` — manages current user/auth state, likely interacts with API endpoints
- `ThemeContext` — dark/light/system theming with persisted preference

### Components

- `components/ui/*` — UI library building blocks built on Radix primitives
- `components/guards/*` — guard components used by routes
- Layouts, Navbar, Sidebars, Dialogs, Dropdowns, Cards, etc.

### Data Fetching

- TanStack Query for server state and caching (global query client created in `main.tsx`)
- HTTP via `axios` (see hooks under `src/hooks/api.ts` and usage under feature components)

### API Configuration

- `src/lib/config.ts`
  - `API.BASE_URL` points to `http://localhost:5106/api`
  - `ENDPOINTS` maps logical operations to routes for Auth, User, Workspace

### Forms and Validation

- `react-hook-form` with `zod` via `@hookform/resolvers`
- Auth forms under `components/auth/forms/*`

### Styling

- Tailwind with `globals.css` and `custom.css`
- animations via `tw-animate-css`

### Navigation Helpers

- `ROUTE_HELPERS` in `router-paths.ts` provide utilities like `getBoardRoute(workspaceId)`

### Error Handling and UX

- Toaster notifications via `sonner`
- Suspense fallback `Loading` around routes


