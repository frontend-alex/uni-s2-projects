import type { User } from "@/types/user";
import type { ApiError } from "@/types/api";

import { toast } from "sonner";
import { API } from "@/lib/config";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation, useApiQuery } from "@/hooks/hook";
import { createContext, useContext, useMemo } from "react";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
  logout: () => void;
  refetch: () => void;
  update: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useApiQuery<{ user: User }>(
    ["auth", "me"],
    API.ENDPOINTS.USER.ME,
    {
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 15,
      enabled: true,
    }
  );

  const { mutateAsync: logoutMutation } = useApiMutation(
    "POST",
    API.ENDPOINTS.AUTH.LOGOUT,
    {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.setQueryData(["auth", "me"], null);
        navigate("/", { replace: true });
      },
    }
  );


  const { mutateAsync: updateMutation } = useApiMutation(
    "PUT",
    API.ENDPOINTS.USER.UPDATE,
    {
      invalidateQueries: [["auth", "me"]],
      onSuccess: (data) => {
        console.log(data)
        toast.success(data.message)
      },
    }
  );

  const logout = async () => {
    await logoutMutation(undefined);
  };

  const update = async (payload: Partial<User>) => {
    await updateMutation(payload);
  };

  const contextValue = useMemo<AuthContextType>(() => {
    return {
      user: data?.data?.user ?? null,
      isLoading,
      error,
      isAuthenticated: Boolean(data?.data) && !error,
      logout,
      refetch,
      update,
    };
  }, [data, isLoading, error, refetch, logout]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
};
