import type { ReactNode } from "react";
import { RouterProvider, type RouterProviderProps } from "react-router-dom";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

type TRouter = RouterProviderProps["router"];

export function setupRouter(router: TRouter, queryClient: QueryClient) {
  return {
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    ),
  };
}

export function renderComponent(Component: ReactNode, queryClient: QueryClient) {
  return {
    user: userEvent.setup(),
    ...render(<QueryClientProvider client={queryClient}>{Component}</QueryClientProvider>),
  };
}
