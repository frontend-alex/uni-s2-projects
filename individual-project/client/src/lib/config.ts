import { Notebook } from "lucide-react";

export const config = {
  app: {
    name: "PeerLearn",
    icon: Notebook,
  },
  user: {
    allowedUpdates: ["username", "email", "password", "emailVerified"],
    passwordRules: {
      minLength: 6,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSymbol: true,
    },
  },
  providers: {
    google: true,
    github: true,
  },
};

export const API = {
  // BASE_URL: `${import.meta.env.VITE_API_URL}/v1` || "http://localhost:5062/api/v1/",
  BASE_URL: `http://localhost:5106/api`,
  QK: {},
  ENDPOINTS: {
    AUTH: {
      REGISTER: "/Auth/register",
      LOGIN: "/Auth/login",
      LOGOUT: "/Auth/logout",


      OTP: {
        GENERATE: "/Otp/send",
        VERIFY: "/Otp/verify",
      },

      FORGOT_PASSWORD: "/auth/forgot-password",
      RESET_PASSWORD: "/auth/reset-password",
      CHANGE_PASSWORD: "/auth/change-password",
    },
    USER: {
      ME: "/User/me",
    },
  },
};
