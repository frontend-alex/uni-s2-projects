import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "@/components/Loading";
import { ROUTES } from "@/lib/router-paths";

const AuthGuard = () => {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) return <Loading />;

  if (isAuthenticated) {
    return (
      <Navigate
        to={
          user?.onboarding
            ? ROUTES.AUTHENTICATED.DASHBOARD
            : ROUTES.AUTHENTICATED.ONBOARDING
        }
        replace
      />
    );
  }

  return <Outlet />;
};

export default AuthGuard;
