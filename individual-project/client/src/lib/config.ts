import { Notebook } from "lucide-react";

export const config = {
    app: {
        name: "PeerLearn",
        icon: Notebook
    },
    user: {
        allowedUpdates: ['username', 'email', 'password', 'emailVerified'],
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
    }
}

export const API = {
    // BASE_URL: `${import.meta.env.VITE_API_URL}/v1` || "http://localhost:5062/api/v1/",
    BASE_URL: `http://localhost:5062/api/v1/` ,
    QK: {

    },
    ENDPOINTS: {
        AUTH: {
            REGISTER: "/auth/register",
            LOGIN: "/auth/login",
            LOGOUT: "/auth/logout",
            FORGOT_PASSWORD: "/auth/forgot-password",
            RESET_PASSWORD: "/auth/reset-password",
            CHANGE_PASSWORD: "/auth/change-password",
            PROVIDERS: "/auth/providers",
        }, 
        USER: {
            ME: '/User/me'
        }
    }
}