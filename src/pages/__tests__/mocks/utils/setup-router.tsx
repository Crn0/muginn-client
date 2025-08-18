import { RouterProvider, type RouterProviderProps } from "react-router-dom";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

type TRouter = RouterProviderProps["router"];

export const setupRouter = (router: TRouter, queryClient: QueryClient) => {
  return {
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    ),
  };
};
