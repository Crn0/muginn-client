import { createMemoryRouter, useRouteError } from "react-router-dom";
import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";

import setupRouter from "./mocks/utils/setup-router";
import { paths } from "../../configs/index";
import LoginPage from "../login";
import DashBoard, { dashBoardLoader } from "./mocks/dash-board";

function ErrorBoundary() {
  const error = useRouteError();

  return <div>{error.message}</div>;
}

const queryClient = new QueryClient();

const routes = [
  {
    path: paths.dashboard.path,
    loader: dashBoardLoader(queryClient),
    errorElement: <ErrorBoundary />,
    element: <DashBoard />,
  },
  {
    path: paths.login.path,
    element: <LoginPage />,
  },
];

afterEach(() => {
  vi.clearAllMocks();
});

describe("Login page", () => {
  const form = {
    invalid: {
      username: "@john@#doe",
      password: "password",
    },
    notFound: {
      username: "odin.project",
      password: "Password123",
    },
    valid: {
      username: ".crno.",
      password: "Crnocrno123",
    },
  };

  describe("UI Rendering", () => {
    it("renders the login page", async () => {
      const router = createMemoryRouter(routes, {
        initialEntries: ["/login"],
      });

      setupRouter(router, queryClient);

      await waitFor(() => {
        expect(screen.getByRole("form")).toBeInTheDocument();
        expect(screen.getByLabelText("USERNAME")).toBeInTheDocument();
        expect(screen.getByLabelText("PASSWORD")).toBeInTheDocument();
        expect(screen.getByTestId("login_btn")).toBeInTheDocument();
        expect(screen.getByTestId("google_btn")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Register" })).toBeInTheDocument();
      });
    });
  });

  describe("Form Validation", () => {
    it("shows validation errors when input is invalid", async () => {
      const { invalid } = form;

      const router = createMemoryRouter(routes, {
        initialEntries: ["/login"],
      });

      const { user } = setupRouter(router, queryClient);

      await waitFor(async () => {
        await user.type(screen.getByLabelText("USERNAME"), invalid.username);
        await user.type(screen.getByLabelText("PASSWORD"), invalid.password);

        await user.click(screen.getByRole("button", { name: "Log in" }));
      });

      await waitFor(() => {
        expect(
          screen.getByText(
            "Username can only contain letters (A-Z, a-z), numbers (0-9), and the characters: _ , ."
          )
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number and no spaces"
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe("Authentication Failure", () => {
    it("shows an invalid credential error when no user matches the username", async () => {
      const { notFound } = form;

      const router = createMemoryRouter(routes, {
        initialEntries: ["/login"],
      });

      const { user } = setupRouter(router, queryClient);

      await waitFor(async () => {
        await user.type(screen.getByLabelText("USERNAME"), notFound.username);
        await user.type(screen.getByLabelText("PASSWORD"), notFound.password);

        await user.click(screen.getByRole("button", { name: "Log in" }));
      });

      await waitFor(() => {
        expect(screen.getByText("Invalid user credentials")).toBeInTheDocument();
      });
    });
  });

  describe("Success Case", () => {
    it("logins the user and redirect to /chats/me", async () => {
      const { valid } = form;

      const router = createMemoryRouter(routes, {
        initialEntries: ["/login"],
      });

      const { user } = setupRouter(router, queryClient);

      await user.type(screen.getByLabelText("USERNAME"), valid.username);
      await user.type(screen.getByLabelText("PASSWORD"), valid.password);

      await user.click(screen.getByRole("button", { name: "Log in" }));

      await waitFor(() => {
        expect(document.cookie.includes("refreshToken")).toBeTruthy();
        expect(screen.getByText(valid.username)).toBeInTheDocument();
      });
    });

    it("redirects the user to dashboard when theres' a authenticated user", async () => {
      const { valid } = form;

      const router = createMemoryRouter(routes, {
        initialEntries: ["/login"],
      });

      setupRouter(router, queryClient);

      await waitFor(() => {
        expect(screen.getByText(valid.username)).toBeInTheDocument();
      });
    });
  });
});
