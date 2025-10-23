import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "@/components/Loading";
import { ROUTES } from "@/lib/router-paths";

const LandingGuard = () => {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) return <Loading />;

  // If user is authenticated and has completed onboarding, redirect to dashboard
  if (isAuthenticated && user?.onboarding) {
    return <Navigate to={ROUTES.AUTHENTICATED.DASHBOARD} replace />;
  }

  // If user is authenticated but hasn't completed onboarding, redirect to onboarding
  if (isAuthenticated && !user?.onboarding) {
    return <Navigate to={ROUTES.AUTHENTICATED.ONBOARDING} replace />;
  }

  // If not authenticated, show the landing page
  return <Outlet />;
};

export default LandingGuard;
