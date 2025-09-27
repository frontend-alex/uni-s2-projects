import Loading from "@/components/Loading";

import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import AppLogo from "../AppLogo";

const AuthLayout = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <Loading/>;

  if (isAuthenticated) {
    return <Navigate to="/dashboard"/>;
  }

  return (
    <div className="grid lg:grid-cols-2">
      {/* Left Side - Content */}
      <div className="flex flex-col gap-4">
        <Outlet />
      </div>
      
      {/* Right Side - Image/Logo */}
      <div className="bg-accent relative hidden lg:block">
        <div className="flex items-center justify-center h-full">
          <AppLogo />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
