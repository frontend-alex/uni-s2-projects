import AppLogo from "@/components/AppLogo";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiMutation } from "@/hooks/hook";
import { LoginForm } from "@/components/auth/forms/login/login-form-02";

import {
  loginSchema,
  type LoginSchemaType,
} from "@/utils/schemas/auth/auth.schema";
import { API } from "@/lib/config";

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
    API.ENDPOINTS.AUTH.LOGIN,
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

  // const { data: providers } = useApiQuery<string[]>(["providers"], "/auth/providers");

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
        providers={[]}
      />
    </div>
  );
};

export default Login;
