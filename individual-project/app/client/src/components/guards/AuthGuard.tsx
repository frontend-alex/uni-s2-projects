import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "@/components/Loading";

const AuthGuard = () => {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) return <Loading />;

  if (isAuthenticated) {
    return <Navigate to={user?.onboarding ? "/dashboard" : "/onboarding"} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
