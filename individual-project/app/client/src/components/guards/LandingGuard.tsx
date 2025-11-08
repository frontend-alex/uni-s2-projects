import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "@/components/Loading";
import { ROUTES } from "@/lib/router-paths";

const LandingGuard = () => {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) return <Loading />;

  if (isAuthenticated && user?.onboarding) {
    return <Navigate to={ROUTES.AUTHENTICATED.DASHBOARD} replace />;
  }

  if (isAuthenticated && !user?.onboarding) {
    return <Navigate to={ROUTES.AUTHENTICATED.ONBOARDING} replace />;
  }

  return <Outlet />;
};

export default LandingGuard;
