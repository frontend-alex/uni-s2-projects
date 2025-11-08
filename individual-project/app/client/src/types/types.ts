import type { UseFormReturn } from "react-hook-form";
import type {
  LoginSchemaType,
  OtpSchemaType,
  RegistrationSchemaType,
  resetPasswordSchemaType,
} from "@/utils/schemas/auth/auth.schema";
import type { WorkspaceSchemaType } from "@/utils/schemas/workspace/workspace.schema";
import type { DocumentSchemaType } from "@/utils/schemas/document/document.schema";

export interface LoginFormProps {
  loginForm: UseFormReturn<LoginSchemaType>;
  handleSubmit: (data: LoginSchemaType) => void;
  isPending: boolean;
  providers?: string[] | undefined;
}

export interface RegisterFormProps {
  registerForm: UseFormReturn<RegistrationSchemaType>;
  handleSubmit: (data: RegistrationSchemaType) => void;
  isPending: boolean;
  providers?: string[] | undefined;
}

export interface OtpFormProps {
  otpForm: UseFormReturn<OtpSchemaType>;
  isOtpverifying: boolean;
  isOtpPending: boolean;
  cooldown: number;
  handleSubmit: (data: OtpSchemaType) => void;
  resendOtp: () => void;
}

export interface ForgotPasswordFormProps {
  forgotPasswordForm: UseFormReturn<{ email: string }>;
  handleSubmit: (data: { email: string }) => void;
  isPending: boolean;
}

export interface ResetPasswordFormProps {
  resetPasswordForm: UseFormReturn<resetPasswordSchemaType>;
  handleSubmit: (data: resetPasswordSchemaType) => void;
  isPending: boolean;
}

export interface WorkspaceFormProps {
  workspaceForm: UseFormReturn<WorkspaceSchemaType>;
  isPending: boolean;
}

export interface DocumentFormProps {
  documentForm: UseFormReturn<DocumentSchemaType>;
  isPending: boolean;
}
