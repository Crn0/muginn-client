import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { paths } from "../configs";
import rootLoader from "./root/loader";
import { clientLoader as silentLoginLoader } from "../features/auth/api/index";

import { clientAction as userAction } from "../features/users/api";

import AppRoot from "./root";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import UserSettingsPage from "../pages/user-settings";
import SilentLoginPage from "../pages/silent-login";

const createRouter = (queryClient) =>
  createBrowserRouter([
    {
      path: paths.register.path,
      element: <RegisterPage />,
    },
    {
      path: paths.login.path,
      element: <LoginPage />,
    },
    {
      path: paths.silentLogin.path,
      loader: silentLoginLoader,
      element: <SilentLoginPage />,
    },
    {
      path: paths.home.path,
      loader: rootLoader(queryClient),
      element: <AppRoot />,
      children: [
        {
          path: paths.user.settings.path,
          action: userAction(queryClient),
          element: <UserSettingsPage />,
        },
      ],
    },
  ]);

export default function AppRouter() {
  const queryClient = useQueryClient();

  const router = createRouter(queryClient);

  return <RouterProvider router={router} />;
}
