import Loading from "@/components/Loading";
import TitleWrapper from "@/components/TitleWrapper";

import { Suspense } from "react";
import { Dashboard, Board, Profile, Settings, OnboardingPage } from "@/routes/(root)";
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
import { AppGuard, AuthGuard, OnboardingGuard, LandingGuard } from "./components/guards";
import RootLayout from "./components/layouts/RootLayout";
import { ROUTES } from "@/lib/router-paths";

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public landing */}
        <Route element={<LandingGuard />}>
          <Route
            path={ROUTES.PUBLIC.LANDING}
            element={
              <TitleWrapper title="Landing Page">
                <LandingPage />
              </TitleWrapper>
            }
          />
        </Route>

        {/* Public-only auth routes */}
        <Route element={<AuthGuard />}>
          <Route
            path={ROUTES.PUBLIC.LOGIN}
            element={
              <TitleWrapper title="Login Page">
                <Login />
              </TitleWrapper>
            }
          />
          <Route
            path={ROUTES.PUBLIC.REGISTER}
            element={
              <TitleWrapper title="Register Page">
                <Register />
              </TitleWrapper>
            }
          />
          <Route
            path={ROUTES.PUBLIC.VERIFY_EMAIL}
            element={
              <TitleWrapper title="Verify Email">
                <Otp />
              </TitleWrapper>
            }
          />
          <Route
            path={ROUTES.PUBLIC.FORGOT_PASSWORD}
            element={
              <TitleWrapper title="Recover Page">
                <ForgotPassword />
              </TitleWrapper>
            }
          />
          <Route
            path={ROUTES.PUBLIC.RESET_PASSWORD}
            element={
              <TitleWrapper title="Recover Page">
                <ResetPassword />
              </TitleWrapper>
            }
          />
          <Route
            path={ROUTES.PUBLIC.AUTH_CALLBACK}
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
            path={ROUTES.AUTHENTICATED.ONBOARDING}
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
              path={`${ROUTES.BASE.APP}/board/:workspaceId`}
              element={
                <TitleWrapper title="Workspace Board">
                  <Board />
                </TitleWrapper>
              }
            />
            <Route
              path={ROUTES.AUTHENTICATED.PROFILE}
              element={
                <TitleWrapper title="Profile Page">
                  <Profile />
                </TitleWrapper>
              }
            />
            <Route
              path={ROUTES.AUTHENTICATED.SETTINGS}
              element={
                <TitleWrapper title="Settings Page">
                  <Settings />
                </TitleWrapper>
              }
            />
            {/* Legacy dashboard route (kept for backward compatibility) */}
            <Route
              path={ROUTES.AUTHENTICATED.DASHBOARD}
              element={
                <TitleWrapper title="Dashboard Page">
                  <Dashboard />
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
