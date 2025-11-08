import Loading from "@/components/Loading";
import TitleWrapper from "@/components/TitleWrapper";
import RootLayout from "./components/layouts/RootLayout";


import { Suspense, lazy } from "react";
import { ROUTES } from "@/lib/router-paths";
import { Route, Routes } from "react-router-dom";
import {
  AppGuard,
  AuthGuard,
  OnboardingGuard,
  LandingGuard,
} from "./components/guards";



// Import LandingPage directly (not lazy) - it's the first page users see, should load instantly
import LandingPage from "@/routes/(auth)/LandingPage";

// Auth routes
const Login = lazy(() => import("@/routes/(auth)/auth/Login"));
const Register = lazy(() => import("@/routes/(auth)/auth/Register"));
const Otp = lazy(() => import("@/routes/(auth)/auth/Otp"));
const ForgotPassword = lazy(() => import("@/routes/(auth)/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/routes/(auth)/auth/ResetPassword"));
const AuthCallback = lazy(() => import("@/routes/(auth)/AuthCallback"));

// App routes
const Dashboard = lazy(() => import("@/routes/(root)/Dashboard"));
const Profile = lazy(() => import("@/routes/(root)/profile/Profile"));
const Settings = lazy(() => import("@/routes/(root)/settings/Setting"));
const OnboardingPage = lazy(() => import("@/routes/(root)/Onboarding"));
const Workspace = lazy(() => import("@/routes/(root)/workspace/Workspace"));
const WorkspaceEdit = lazy(() => import("@/routes/(root)/workspace/WorkspaceEdit"));
const Document = lazy(() => import("@/routes/(root)/document/Document"));
const DocumentEdit = lazy(() => import("@/routes/(root)/document/DocumentEdit"));

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public landing */}
        <Route element={<LandingGuard />}>
          <Route
            path={ROUTES.PUBLIC.LANDING}
            element={
              <TitleWrapper title="PeerLearn | Home">
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
              <TitleWrapper title="PeerLearn | Login">
                <Login />
              </TitleWrapper>
            }
          />
          <Route
            path={ROUTES.PUBLIC.REGISTER}
            element={
              <TitleWrapper title="PeerLearn | Register">
                <Register />
              </TitleWrapper>
            }
          />
          <Route
            path={ROUTES.PUBLIC.VERIFY_EMAIL}
            element={
              <TitleWrapper title="PeerLearn | Verify Email">
                <Otp />
              </TitleWrapper>
            }
          />
          <Route
            path={ROUTES.PUBLIC.FORGOT_PASSWORD}
            element={
              <TitleWrapper title="PeerLearn | Forgot Password">
                <ForgotPassword />
              </TitleWrapper>
            }
          />
          <Route
            path={ROUTES.PUBLIC.RESET_PASSWORD}
            element={
              <TitleWrapper title="PeerLearn | Reset Password">
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
              <TitleWrapper title="PeerLearn | Onboarding">
                <OnboardingPage />
              </TitleWrapper>
            }
          />
        </Route>

        {/* Protected app */}
        <Route element={<AppGuard />}>
          <Route element={<RootLayout />}>
            <Route
              path={ROUTES.AUTHENTICATED.PROFILE}
              element={
                <TitleWrapper title="PeerLearn | Profile">
                  <Profile />
                </TitleWrapper>
              }
            />
            <Route
              path={ROUTES.AUTHENTICATED.SETTINGS}
              element={
                <TitleWrapper title="PeerLearn | Settings">
                  <Settings />
                </TitleWrapper>
              }
            />
            <Route
              path={ROUTES.AUTHENTICATED.DASHBOARD}
              element={
                <TitleWrapper title="PeerLearn | Dashboard">
                  <Dashboard />
                </TitleWrapper>
              }
            />

            <Route
              path={`${ROUTES.BASE.APP}/workspace/:workspaceId`}
              element={
                <TitleWrapper title="PeerLearn | Workspace">
                  <Workspace />
                </TitleWrapper>
              }
            />
             <Route
              path={`${ROUTES.BASE.APP}/workspace/:workspaceId/edit`}
              element={
                <TitleWrapper title="PeerLearn | Workspace Edit">
                  <WorkspaceEdit />
                </TitleWrapper>
              }
            />
            <Route
              path={`${ROUTES.BASE.APP}/workspace/:workspaceId/document/:documentId`}
              element={
                <TitleWrapper title="PeerLearn | Document">
                  <Document />
                </TitleWrapper>
              }
            />
            <Route
              path={`${ROUTES.BASE.APP}/workspace/:workspaceId/document/:documentId/edit`}
              element={
                <TitleWrapper title="PeerLearn | Document Edit">
                  <DocumentEdit />
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
