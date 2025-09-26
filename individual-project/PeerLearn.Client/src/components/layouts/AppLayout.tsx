import Loading from "@/components/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AppLayout = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();


  if (isLoading) return <Loading />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AppLayout;
