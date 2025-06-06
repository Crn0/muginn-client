import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { paths } from "../configs";

const convert = (queryClient) => async (m) => {
  const { clientAction, clientLoader, default: Component } = m;

  return {
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    element: <Component />,
  };
};

const createRouter = (queryClient) =>
  createBrowserRouter([
    {
      path: paths.register.path,
      lazy: () => import("../pages/register").then(convert(queryClient)),
    },
    {
      path: paths.login.path,
      lazy: () => import("../pages/login").then(convert(queryClient)),
    },
  ]);

export default function AppRouter() {
  const queryClient = new QueryClient();

  const router = createRouter(queryClient);

  return <RouterProvider router={router} />;
}
