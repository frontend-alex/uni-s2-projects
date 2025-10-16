// Base paths
export const BASE_PATHS = {
  APP: '/app/v1',
  AUTH: '/auth',
} as const;

// Public routes (no authentication required)
export const PUBLIC_ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  AUTH_CALLBACK: '/auth/callback',
} as const;

// Authenticated routes (require authentication)
export const AUTHENTICATED_ROUTES = {
  ONBOARDING: '/onboarding',
  BOARD: (workspaceId: string | number) => `${BASE_PATHS.APP}/board/${workspaceId}`,
  PROFILE: `${BASE_PATHS.APP}/profile`,
  SETTINGS: `${BASE_PATHS.APP}/settings`,
  // Legacy dashboard route (kept for backward compatibility)
  DASHBOARD: '/dashboard',
} as const;

// Default workspace ID for new users
export const DEFAULT_WORKSPACE_ID = 1;

// Helper functions for common route operations
export const ROUTE_HELPERS = {
  /**
   * Get the board route for a specific workspace
   */
  getBoardRoute: (workspaceId: string | number = DEFAULT_WORKSPACE_ID) => 
    AUTHENTICATED_ROUTES.BOARD(workspaceId),
  
  /**
   * Check if a route is an authenticated route
   */
  isAuthenticatedRoute: (path: string): boolean => {
    return path.startsWith(BASE_PATHS.APP) || 
           path === AUTHENTICATED_ROUTES.ONBOARDING ||
           path === AUTHENTICATED_ROUTES.DASHBOARD;
  },
  
  /**
   * Check if a route is a public route
   */
  isPublicRoute: (path: string): boolean => {
    return Object.values(PUBLIC_ROUTES).includes(path as any);
  },
} as const;

// Export all routes for easy access
export const ROUTES = {
  PUBLIC: PUBLIC_ROUTES,
  AUTHENTICATED: AUTHENTICATED_ROUTES,
  BASE: BASE_PATHS,
  HELPERS: ROUTE_HELPERS,
} as const;
