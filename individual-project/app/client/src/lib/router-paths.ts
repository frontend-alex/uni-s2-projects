
export const BASE_PATHS = {
  APP: '/app/v1',
  AUTH: '/auth',
} as const;

export const PUBLIC_ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  AUTH_CALLBACK: '/auth/callback',
} as const;

export const AUTHENTICATED_ROUTES = {
  ONBOARDING: '/onboarding',
  BOARD: (workspaceId: string | number) => `${BASE_PATHS.APP}/workspace/${workspaceId}`,
  PROFILE: `${BASE_PATHS.APP}/profile`,
  SETTINGS: `${BASE_PATHS.APP}/settings`,
  DASHBOARD: `${BASE_PATHS.APP}/dashboard`,
  DOCUMENT: (documentId: string | number, workspaceId: string | number) => `${BASE_PATHS.APP}/workspace/${workspaceId}/document/${documentId}`,
} as const;

export const ROUTE_HELPERS = {
  getBoardRoute: (workspaceId: string | number) => 
    AUTHENTICATED_ROUTES.BOARD(workspaceId),
  
  isAuthenticatedRoute: (path: string): boolean => {
    return path.startsWith(BASE_PATHS.APP) || 
           path === AUTHENTICATED_ROUTES.ONBOARDING ||
           path === AUTHENTICATED_ROUTES.DASHBOARD;
  },
  
  isPublicRoute: (path: string): boolean => {
    return Object.values(PUBLIC_ROUTES).includes(path as any);
  },
} as const;

export const getCurrentRoute = (pathname: string) => {
  const match = pathname.match(BASE_PATHS.APP + "/([^/]+)");
  return match ? match[1] : "";
};
  

export const ROUTES = {
  PUBLIC: PUBLIC_ROUTES,
  AUTHENTICATED: AUTHENTICATED_ROUTES,
  BASE: BASE_PATHS,
  HELPERS: ROUTE_HELPERS,
} as const;
