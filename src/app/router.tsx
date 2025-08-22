import { ErrorBoundary } from "react-error-boundary";
import { createBrowserRouter } from "react-router-dom";

import { paths } from "@/configs";
import { queryClient } from "./query-client";
import { loader as protectedLoader } from "./protected/loader";
import { clientLoader as silentLoginLoader } from "@/features/auth/api";

import { ErrorElement, RouteErrorElement } from "@/components/errors";
import { ProtectedRoute } from "./protected";
import {
  LoginPage,
  RegisterPage,
  UserSettingsPage,
  ChatSettingsPage,
  SilentLoginPage,
  DashBoardPage,
} from "@/pages";
import { DashBoardMe } from "@/features/dashboard/components";
import { GroupChatView } from "@/features/chats/components";

export const router = createBrowserRouter([
  {
    path: paths.register.path,
    errorElement: <RouteErrorElement />,
    element: (
      <ErrorBoundary FallbackComponent={ErrorElement}>
        <RegisterPage />
      </ErrorBoundary>
    ),
  },
  {
    path: paths.login.path,
    errorElement: <RouteErrorElement />,
    element: (
      <ErrorBoundary FallbackComponent={ErrorElement}>
        <LoginPage />
      </ErrorBoundary>
    ),
  },
  {
    path: paths.silentLogin.path,
    loader: silentLoginLoader(queryClient),
    errorElement: <RouteErrorElement />,
    element: <SilentLoginPage />,
  },
  {
    path: paths.protected.root.path,
    loader: protectedLoader(queryClient),
    element: (
      <ErrorBoundary FallbackComponent={ErrorElement}>
        <ProtectedRoute />
      </ErrorBoundary>
    ),
    errorElement: <RouteErrorElement />,
    children: [
      {
        path: paths.protected.dashboard.root.path,
        errorElement: <RouteErrorElement />,
        element: <DashBoardPage />,
        children: [
          {
            path: paths.protected.dashboard.me.path,
            element: <DashBoardMe />,
          },
          {
            path: paths.protected.dashboard.groupChat.path,
            element: <GroupChatView />,
          },
        ],
      },
      {
        path: paths.protected.userSettings.path,
        errorElement: <RouteErrorElement />,
        element: <UserSettingsPage />,
      },
      {
        path: paths.protected.chatSettings.path,
        errorElement: <RouteErrorElement />,
        element: <ChatSettingsPage />,
      },
    ],
  },
]);
