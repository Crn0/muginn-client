import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export function setupRouter(routes, initialEntries, queryClient) {
  return {
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={createMemoryRouter(routes, { initialEntries })} />
      </QueryClientProvider>
    ),
  };
}

export function renderComponent(Component, queryClient) {
  return {
    user: userEvent.setup(),
    ...render(<QueryClientProvider client={queryClient}>{Component}</QueryClientProvider>),
  };
}
