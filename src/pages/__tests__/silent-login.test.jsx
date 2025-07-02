import { createMemoryRouter, replace } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";

import setupRouter from "./mocks/utils/setup-router";
import { paths } from "../../configs/index";
import { generateAccessToken } from "../../../test/utils";
import { setToken } from "../../stores";
import { clientLoader } from "../../features/auth/api";
import SilentLogin from "../silent-login";
import DashBoard, { dashBoardLoader } from "./mocks/dash-board";
import { RouteErrorElement } from "../../components/errors";

vi.mock("../../features/auth/api");

const waitResolve = (data, ms = 1000) =>
  new Promise((r) => {
    setTimeout(() => r(typeof data === "function" ? data() : data), ms);
  });

const waitReject = (data, ms = 1000) =>
  new Promise((_, r) => {
    setTimeout(() => r(typeof data === "function" ? data() : data), ms);
  });

const queryClient = new QueryClient();

const createRouter = (initialEntries) =>
  createMemoryRouter(
    [
      {
        path: paths.dashboard.me.getHref(),
        loader: dashBoardLoader(queryClient),
        errorElement: <RouteErrorElement />,
        element: <DashBoard />,
      },
      {
        path: paths.silentLogin.path,
        loader: clientLoader(queryClient),
        errorElement: <RouteErrorElement />,
        element: <SilentLogin />,
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
  describe("Error Boundary Trigger", () => {
    it("throws when the user query fails with a network error (e.g., 'Failed to fetch')", async () => {
      vi.mocked(clientLoader).mockImplementationOnce(() => async () => ({
        data: waitReject(new Error("Failed to Fetch"), 10),
      }));

      setupRouter(createRouter([paths.silentLogin.getHref()]), queryClient);

      await waitFor(() => {
        expect(screen.getByTestId("spinner")).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText("Failed to Fetch")).toBeInTheDocument();
      });
    });
  });

  describe("Authentication Error", () => {
    it("shows a loading indicator and redirects the user to /login", async () => {
      vi.mocked(clientLoader).mockImplementationOnce(() => async () => ({
        data: waitReject(() => replace(paths.login.getHref()), 10),
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

      vi.mocked(clientLoader).mockImplementationOnce(() => async () => ({
        data: waitResolve(token, 10),
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
