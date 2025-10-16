import Loading from "@/components/Loading";
import TitleWrapper from "@/components/TitleWrapper";

import { Suspense } from "react";
import { Dashboard, Profile, Settings, OnboardingPage } from "@/routes/(root)";
import { Route, Routes } from "react-router-dom";
import {
  AuthCallback,
  ResetPassword,
  ForgotPassword,
  LandingPage,
  Login,
  Otp,
  Register,
} from "@/routes/(auth)";
import { AppGuard, AuthGuard, OnboardingGuard } from "./components/guards";
import RootLayout from "./components/layouts/RootLayout";

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public landing */}
        <Route
          path="/"
          element={
            <TitleWrapper title="Landing Page">
              <LandingPage />
            </TitleWrapper>
          }
        />

        {/* Public-only auth routes */}
        <Route element={<AuthGuard />}>
          <Route
            path="/login"
            element={
              <TitleWrapper title="Login Page">
                <Login />
              </TitleWrapper>
            }
          />
          <Route
            path="/register"
            element={
              <TitleWrapper title="Register Page">
                <Register />
              </TitleWrapper>
            }
          />
          <Route
            path="/verify-email"
            element={
              <TitleWrapper title="Verify Email">
                <Otp />
              </TitleWrapper>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <TitleWrapper title="Recover Page">
                <ForgotPassword />
              </TitleWrapper>
            }
          />
          <Route
            path="/reset-password"
            element={
              <TitleWrapper title="Recover Page">
                <ResetPassword />
              </TitleWrapper>
            }
          />
          <Route
            path="/auth/callback"
            element={
              <TitleWrapper title="Verifying...">
                <AuthCallback />
              </TitleWrapper>
            }
          />
        </Route>

        {/* Onboarding (auth-only, not completed) */}
        <Route element={<OnboardingGuard />}>
          <Route
            path="/onboarding"
            element={
              <TitleWrapper title="Onboarding">
                <OnboardingPage />
              </TitleWrapper>
            }
          />
        </Route>

        {/* Protected app */}
        <Route element={<AppGuard />}>
          <Route element={<RootLayout />}>
            <Route
              path="/dashboard"
              element={
                <TitleWrapper title="Dashboard Page">
                  <Dashboard />
                </TitleWrapper>
              }
            />
            <Route
              path="/profile"
              element={
                <TitleWrapper title="Profile Page">
                  <Profile />
                </TitleWrapper>
              }
            />
            <Route
              path="/settings"
              element={
                <TitleWrapper title="Settings Page">
                  <Settings />
                </TitleWrapper>
              }
            />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
