import { ErrorBoundary } from "react-error-boundary";
import { createBrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { paths } from "../configs";
import queryClient from "./query-client";
import protectedLoader from "./root/loader";
import { clientLoader as silentLoginLoader } from "../features/auth/api/index";

import { clientAction as userAction } from "../features/users/api";

import { ErrorElement, RouteErrorElement } from "../components/errors";
import ProtectedRoot from "./root";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import UserSettingsPage from "../pages/user-settings";
import SilentLoginPage from "../pages/silent-login";
import DashBoardPage from "../pages/dashboard";
import DashBoardMe from "../features/dashboard/components/dashboard-me";
import GroupChatView from "../features/chats/components/group-chat-view";

const router = createBrowserRouter([
  {
    path: paths.register.path,
    errorElement: <RouteErrorElement />,
    element: (
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary FallbackComponent={ErrorElement}>
          <RegisterPage />,
        </ErrorBoundary>
      </QueryClientProvider>
    ),
  },
  {
    path: paths.login.path,
    errorElement: <RouteErrorElement />,
    element: (
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary FallbackComponent={ErrorElement}>
          <LoginPage />
        </ErrorBoundary>
        ,
      </QueryClientProvider>
    ),
  },
  {
    path: paths.silentLogin.path,
    loader: silentLoginLoader,
    errorElement: <RouteErrorElement />,
    element: (
      <QueryClientProvider client={queryClient}>
        <SilentLoginPage />,
      </QueryClientProvider>
    ),
  },
  {
    path: paths.protected.root.path,
    loader: protectedLoader(queryClient),
    element: (
      <ErrorBoundary FallbackComponent={ErrorElement}>
        <ProtectedRoot />
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
            index: true,
            element: <DashBoardMe />,
          },
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
        action: userAction(queryClient),
        errorElement: <RouteErrorElement />,
        element: <UserSettingsPage />,
      },
    ],
  },
]);

export default router;
