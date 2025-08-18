import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { LoginForm } from "../login-form";

const queryClient = new QueryClient();
const onSuccess = vi.fn();

describe("Login form", () => {
  it("renders the form", () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <LoginForm onSuccess={onSuccess} />
        </QueryClientProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByLabelText("USERNAME")).toBeInTheDocument();
    expect(screen.getByLabelText("PASSWORD")).toBeInTheDocument();
    expect(screen.getByTestId("login_btn")).toBeInTheDocument();
    expect(screen.getByTestId("google_btn")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Register" })).toBeInTheDocument();
  });
});
