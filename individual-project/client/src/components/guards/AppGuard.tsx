import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "@/components/Loading";

const AppGuard = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) return <Loading />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user?.onboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

export default AppGuard;
