import z from "zod";
import AppLogo from "@/components/AppLogo";

import { toast } from "sonner";
import { makeForm } from "@/lib/utils";
import { useApiMutation } from "@/hooks/hook";
import { emailSchema } from "@/utils/schemas/user/user.schema";
import { ForgotPasswordForm } from "@/components/auth/forms/password/forgot-password-02";

const ForgotPassword = () => {
  const emailSchemaObject = z.object({ email: emailSchema });

  const forgotPasswordForm = makeForm(emailSchemaObject, {
    email: "",
  });

  const { mutateAsync: forgotPassword, isPending } = useApiMutation(
    "POST",
    "/auth/reset-password",
    {
      onSuccess: (data) => toast.success(data.message),
      onError: (err) => toast.error(err.response?.data.message),
    }
  );

  const handleForgotPassword = async (data: { email: string }) =>
    await forgotPassword(data);

  return (
    <div>
      <div className="hidden lg:flex p-5 absolute">
        <AppLogo />
      </div>
        <ForgotPasswordForm
            forgotPasswordForm={forgotPasswordForm}
            isPending={isPending}
            handleSubmit={handleForgotPassword}
        />
    </div>
  );
};

export default ForgotPassword;
