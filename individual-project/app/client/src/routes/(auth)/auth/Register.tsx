import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import AppLogo from "@/components/AppLogo";
import { RegisterForm } from "@/components/auth/forms/register/register-form-03";
import { useApiMutation } from "@/hooks/hook";
import {
  registrationSchema,
  type RegistrationSchemaType,
} from "@/utils/schemas/auth/auth.schema";
import { API } from "@/lib/config";

const Register = () => {
  const navigate = useNavigate();

  const form = useForm<RegistrationSchemaType>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const { mutateAsync: sendOtp } = useApiMutation(
    "POST",
    API.ENDPOINTS.AUTH.OTP.GENERATE,
    {
      onSuccess: (data) => toast.success(data.message),
      onError: (err) => toast.success(err.message),
    }
  );

  const { mutateAsync: register, isPending } = useApiMutation<
    { email: string },
    RegistrationSchemaType
  >("POST", API.ENDPOINTS.AUTH.REGISTER, {
    onSuccess: ({ message, data }) => {
      const email = data?.email;
      if (email) {
        toast.success(message);
        sendOtp({ email });
        navigate(`/verify-email?email=${email}`);
      }
    },
    onError: (err) => {
      const extra = err.response?.data?.extra as {
        otpRedirect?: boolean;
        email?: string;
        userMessage?: string;
      };
      if (extra.otpRedirect && extra.email) {
        navigate(`/verify-email?email=${extra.email}`);
        return;
      }
      toast.error(
        err.response?.data?.userMessage ||
          err.response?.data?.message ||
          "Something went wrong",
        { description: extra.userMessage }
      );
    },
  });

  // const { data: providers } = useApiQuery<string[]>(["providers"], API.ENDPOINTS.AUTH.PROVIDERS);

  const handleRegister = (data: RegistrationSchemaType) => register(data);

  return (
    <div>
      <div className="hidden lg:flex p-5 absolute">
        <AppLogo />
      </div>
      <RegisterForm
        registerForm={form}
        handleSubmit={handleRegister}
        isPending={isPending}
        providers={[]}
      />
    </div>
  );
};

export default Register;
