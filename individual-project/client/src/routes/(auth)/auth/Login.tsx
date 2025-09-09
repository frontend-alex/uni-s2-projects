import AppLogo from "@/components/AppLogo";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiMutation, useApiQuery } from "@/hooks/hook";
import { LoginForm } from "@/components/auth/forms/login/login-form-02";
import type { Providers } from "@/components/auth/forms/buttons/provider-buttons";

import {
  loginSchema,
  type LoginSchemaType,
} from "@/utils/schemas/auth/auth.schema";

const Login = () => {
  const navigate = useNavigate();
  const { refetch } = useAuth();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useApiMutation<LoginSchemaType>(
    "POST",
    "/auth/login",
    {
      onSuccess: () => {
        refetch();
        navigate("/dashboard");
        toast.success("Login successful");
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Login failed");
      },
    }
  );

  const { data: providersRes } = useApiQuery<{
    publicProviders: Providers[];
  }>(["providers"], "/auth/providers");

  const handleLogin = (data: LoginSchemaType) => login(data);

  return (
    <div>
      <div className="hidden lg:flex p-5 absolute">
        <AppLogo />
      </div>
      <LoginForm
        loginForm={form}
        handleSubmit={handleLogin}
        isPending={isPending}
        providers={providersRes?.data?.publicProviders ?? []}
      />
    </div>
  );
};

export default Login;
