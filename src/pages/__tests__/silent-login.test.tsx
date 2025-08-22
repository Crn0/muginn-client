import { createMemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";

import { setupRouter } from "./mocks/utils/setup-router";
import { paths } from "@/configs/index";
import { generateAccessToken } from "../../../test/utils";
import { RouteErrorElement } from "@/components/errors";
import { setToken } from "@/stores";
import { clientLoader } from "@/features/auth/api";
import { DashBoard, dashBoardLoader } from "./mocks/dash-board";
import { SilentLoginPage } from "..";

vi.mock("@/features/auth/api");

function waitResolve<T>(data: T, ms = 1): Promise<T> {
  return new Promise((r) => {
    setTimeout(() => r(typeof data === "function" ? data() : data), ms);
  });
}

const queryClient = new QueryClient();

const createRouter = (initialEntries: string[]) =>
  createMemoryRouter(
    [
      {
        path: paths.protected.dashboard.me.getHref(),
        loader: dashBoardLoader(queryClient),
        errorElement: <RouteErrorElement />,
        element: <DashBoard />,
      },
      {
        path: paths.silentLogin.path,
        loader: clientLoader(queryClient),
        errorElement: <RouteErrorElement />,
        element: <SilentLoginPage />,
      },
      {
        path: paths.login.path,
        element: <p> Login Page</p>,
      },
    ],
    {
      initialEntries,
    }
  );

beforeEach(() => {
  vi.resetAllMocks();
});

describe("SilentLogin page", () => {
  describe("Authentication Error", () => {
    it("shows a loading indicator and redirects the user to /login", async () => {
      vi.mocked(clientLoader).mockImplementationOnce(() => () => ({
        data: waitResolve(null),
      }));

      setupRouter(createRouter([paths.silentLogin.getHref()]), queryClient);

      await waitFor(() => {
        expect(screen.getByTestId("spinner")).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText("Login Page")).toBeInTheDocument();
      });
    });
  });

  describe("Success Case", () => {
    it("shows a loading indicator and redirects the user to dashboard", async () => {
      const token = generateAccessToken(".crno.");

      setToken(token);

      vi.mocked(clientLoader).mockImplementationOnce(() => () => ({
        data: waitResolve(token),
      }));

      setupRouter(createRouter([paths.silentLogin.getHref()]), queryClient);

      await waitFor(() => {
        expect(screen.getByTestId("spinner")).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText(".crno.")).toBeInTheDocument();
      });
    });
  });
});
