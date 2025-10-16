import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import AppLogo from "@/components/AppLogo";
import { OtpForm } from "@/components/auth/forms/otp/otp-form-03";
import { useApiMutation } from "@/hooks/hook";
import {
  otpSchema,
  type OtpSchemaType,
} from "@/utils/schemas/auth/auth.schema";
import { API } from "@/lib/config";

const COOLDOWN_DURATION = 60;
const STORAGE_KEY = "otp_last_sent_at";

const Otp = () => {
  const navigate = useNavigate();
  const email = new URLSearchParams(location.search).get("email") ?? "";
  
  const [cooldown, setCooldown] = useState(0);

  const otpForm = useForm<OtpSchemaType>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "", email },
  });

  const { mutateAsync: sendOtp, isPending: isOtpPending } = useApiMutation(
    "POST",
    API.ENDPOINTS.AUTH.OTP.GENERATE,
    {
      onSuccess: (data) => toast.success(data.message),
      onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to send OTP");
      },
    }
  );

  const { mutateAsync: verifyEmail, isPending: isOtpverifying } = useApiMutation(
    "PUT",
    API.ENDPOINTS.AUTH.OTP.VERIFY,
    {
      onSuccess: () => navigate("/login"),
      onError: (err) => {
        toast.error(err.response?.data?.message || "Invalid OTP");
      },
    }
  );

  const handleSubmit = (data: OtpSchemaType) => {
    verifyEmail(data);
  };

  const resendOtp = async () => {
    if (cooldown > 0) return;

    await sendOtp({ email });
    const now = Date.now();
    localStorage.setItem(STORAGE_KEY, now.toString());
    setCooldown(COOLDOWN_DURATION);
  };

  // On mount: check if cooldown should resume from localStorage
  useEffect(() => {
    const lastSent = localStorage.getItem(STORAGE_KEY);
    if (lastSent) {
      const secondsPassed = Math.floor((Date.now() - Number(lastSent)) / 1000);
      const remaining = COOLDOWN_DURATION - secondsPassed;
      if (remaining > 0) setCooldown(remaining);
    }
  }, []);

  // Cooldown countdown interval
  useEffect(() => {
    if (cooldown === 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  return (
    <div>
      <div className="hidden lg:flex p-5 absolute">
        <AppLogo />
      </div>
      <OtpForm
        cooldown={cooldown}
        otpForm={otpForm}
        isOtpverifying={isOtpverifying}
        isOtpPending={isOtpPending}
        resendOtp={resendOtp}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Otp;
