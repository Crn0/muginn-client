import { createBrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { paths } from "../configs";
import queryClient from "./query-client";
import rootLoader from "./root/loader";
import { clientLoader as silentLoginLoader } from "../features/auth/api/index";

import { clientAction as userAction } from "../features/users/api";
import { clientAction as chatAction } from "../features/chats/api";

import { RouteErrorElement } from "../components/errors";
import AppRoot from "./root";
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
        <RegisterPage />,
      </QueryClientProvider>
    ),
  },
  {
    path: paths.login.path,
    errorElement: <RouteErrorElement />,
    element: (
      <QueryClientProvider client={queryClient}>
        <LoginPage />,
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
    path: paths.home.path,
    loader: rootLoader(queryClient),
    element: <AppRoot />,
    errorElement: <RouteErrorElement />,
    children: [
      {
        path: paths.dashboard.root.path,
        action: chatAction(queryClient),
        errorElement: <RouteErrorElement />,
        element: <DashBoardPage />,
        children: [
          {
            index: true,
            element: <DashBoardMe />,
          },
          {
            path: paths.dashboard.me.path,
            action: chatAction(queryClient),
            element: <DashBoardMe />,
          },
          {
            path: paths.dashboard.groupChat.path,
            element: <GroupChatView />,
          },
        ],
      },
      {
        path: paths.user.settings.path,
        action: userAction(queryClient),
        errorElement: <RouteErrorElement />,
        element: <UserSettingsPage />,
      },
    ],
  },
]);

export default router;
