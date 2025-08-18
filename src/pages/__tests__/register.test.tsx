import { createMemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { faker } from "@faker-js/faker";

import { setupRouter } from "./mocks/utils/setup-router";
import { paths } from "../../configs/index";
import { createUser } from "../../../test/utils";
import { getAuthUserQueryOptions } from "../../lib/auth";
import { setToken } from "../../stores";
import RegisterPage from "../register";
import { DashBoard, dashBoardLoader } from "./mocks/dash-board";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const routes = [
  {
    path: paths.protected.dashboard.me.getHref(),
    loader: dashBoardLoader(queryClient),
    element: <DashBoard />,
  },
  {
    path: paths.register.path,
    element: (
      <QueryClientProvider client={queryClient}>
        <RegisterPage />
      </QueryClientProvider>
    ),
  },
  {
    path: paths.login.path,
    element: <p>Log in</p>,
  },
];

afterEach(() => {
  vi.clearAllMocks();
});

describe("Register Page", () => {
  const form = {
    invalid: {
      displayName: Array.from({ length: 100 })
        .map(() => "John")
        .join(""),
      username: "@john@#doe",
      password: "password",
      confirmPassword: "password_not_match",
    },

    valid: {
      ...createUser(),
    },
  };

  describe("UI Rendering", () => {
    it("renders the register page", async () => {
      const router = createMemoryRouter(routes, {
        initialEntries: [paths.register.getHref({ redirectTo: null })],
      });

      setupRouter(router, queryClient);

      await waitFor(() => {
        expect(screen.getByText("Create an account")).toBeInTheDocument();
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
  });

  describe("Form Validation", () => {
    it("shows validation errors when input is invalid", async () => {
      const { invalid } = form;

      const router = createMemoryRouter(routes, {
        initialEntries: ["/register"],
      });

      const { user } = setupRouter(router, queryClient);

      await user.type(screen.getByLabelText("DISPLAY NAME"), invalid.displayName);
      await user.type(screen.getByLabelText("USERNAME"), invalid.username);
      await user.type(screen.getByLabelText("PASSWORD"), invalid.password);
      await user.type(screen.getByLabelText("CONFIRM PASSWORD"), invalid.confirmPassword);

      await user.click(screen.getByRole("button", { name: "Register" }));

      await waitFor(() => {
        expect(
          screen.getByText("Display name must contain at most 36 character(s)")
        ).toBeInTheDocument();
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
        expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
      });
    });
  });

  describe("Success Case", () => {
    it("register the user and redirect to login page", async () => {
      const { valid } = form;

      const router = createMemoryRouter(routes, {
        initialEntries: ["/register"],
      });

      const { user } = setupRouter(router, queryClient);

      await user.type(screen.getByLabelText("DISPLAY NAME"), valid.displayName);
      await user.type(screen.getByLabelText("USERNAME"), valid.username);
      await user.type(screen.getByLabelText("PASSWORD"), valid.password);
      await user.type(screen.getByLabelText("CONFIRM PASSWORD"), valid.password);
      await user.click(screen.getByTestId("register_btn"));

      expect(screen.getByTestId("register_btn")).toBeDisabled();

      await waitFor(() => {
        expect(screen.getByText("Log in")).toBeInTheDocument();
      });
    });

    it("redirects the user to dashboard when theres' a authenticated user", async () => {
      const { valid } = form;

      setToken("token");

      queryClient.setQueryData(getAuthUserQueryOptions().queryKey, {
        id: faker.string.uuid(),
        email: null,
        username: valid.username,
        status: "Offline",
        accountLevel: 1,
        lastSeenAt: null,
        openIds: [],
        joinedAt: new Date().toISOString(),
        updatedAt: null,
        profile: {
          displayName: valid.displayName,
          aboutMe: null,
          avatar: null,
          backgroundAvatar: null,
        },
      });

      const router = createMemoryRouter(routes, {
        initialEntries: ["/register"],
      });

      setupRouter(router, queryClient);

      await waitFor(() => {
        expect(screen.getByText(valid.username)).toBeInTheDocument();
      });

      queryClient.removeQueries({ queryKey: getAuthUserQueryOptions().queryKey });

      setToken(null);
    });
  });

  describe("Conflict Error", () => {
    it("renders a error message when the username is taken", async () => {
      const { valid } = form;

      const router = createMemoryRouter(routes, {
        initialEntries: ["/register"],
      });

      const { user } = setupRouter(router, queryClient);

      await waitFor(async () => {
        await user.type(screen.getByLabelText("DISPLAY NAME"), valid.displayName);
        await user.type(screen.getByLabelText("USERNAME"), valid.username);
        await user.type(screen.getByLabelText("PASSWORD"), valid.password);
        await user.type(screen.getByLabelText("CONFIRM PASSWORD"), valid.password);

        await user.click(screen.getByTestId("register_btn"));
      });

      await waitFor(() => {
        expect(
          screen.getByText(
            "Username is unavailable. Try adding numbers, underscores _. or periods."
          )
        ).toBeInTheDocument();
      });
    });
  });
});
