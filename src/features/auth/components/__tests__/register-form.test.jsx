import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RegisterForm from "../register-form";

const queryClient = new QueryClient();
const onSuccess = vi.fn();

describe("Register Form", () => {
  it("renders the form", () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <RegisterForm onSuccess={onSuccess} />
        </QueryClientProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByLabelText("DISPLAY NAME")).toBeInTheDocument();
    expect(screen.getByLabelText("USERNAME")).toBeInTheDocument();
    expect(screen.getByLabelText("PASSWORD")).toBeInTheDocument();
    expect(screen.getByLabelText("CONFIRM PASSWORD")).toBeInTheDocument();
    expect(screen.getByTestId("register_btn")).toBeInTheDocument();
    expect(screen.getByTestId("google_btn")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Log in" })).toBeInTheDocument();
  });
});
