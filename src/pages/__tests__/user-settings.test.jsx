import { createMemoryRouter, useRouteError } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import setupRouter from "./mocks/utils/setup-router";
import { getAuthUserQueryOptions } from "../../lib/auth";
import { paths } from "../../configs/index";
import { setToken, getToken } from "../../stores";
import { generateAccessToken } from "../../../test/utils/data-generator";
import { clientAction } from "../../features/users/api";
import UserSettingsPage from "../user-settings";

function ErrorElement() {
  const error = useRouteError();

  return (
    <>
      <p>{error.message}</p>
      <p>{error.stack}</p>
    </>
  );
}

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const routes = [
  {
    path: paths.user.settings.getHref(),
    errorElement: <ErrorElement />,
    action: async ({ request }) => clientAction(queryClient)({ request }),
    element: (
      <QueryClientProvider client={queryClient}>
        <UserSettingsPage />
      </QueryClientProvider>
    ),
  },
  {
    path: paths.login.getHref(),
    element: <p>Login Page</p>,
  },
];

const router = createMemoryRouter(routes, {
  initialEntries: [paths.user.settings.getHref()],
});

describe("User Settings Page", () => {
  const form = {
    invalid: {
      displayName: Array.from({ length: 100 }, () => "foo").join(""),
      username: "@john@#doe",
      password: "password",
      avatar: new File(["foo"], "foo.txt", { type: "text/plain" }),
    },
    notFound: {
      username: "odin.project",
      password: "Password123",
    },
    valid: {
      displayName: "_crno_",
      username: ".noir.",
      oldPassword: "Crnocrno123",
      newPassword: "Noirnoir123",
      avatar: new File(["hello"], "hello.png", { type: "image/png" }),
    },
  };

  beforeEach(() => {
    try {
      const token = generateAccessToken(".crno.");
      setToken(token);
    } catch (e) {
      const token = generateAccessToken(form.valid.username);
      setToken(token);
    }

    return () => setToken(null);
  });

  describe("UI Rendering", () => {
    it("renders the user settings page with the default tab", async () => {
      const leftNavButtons = ["My Account", "Profiles"];
      const rightNavButtons = ["Security", "Standing"];
      const nonActiveNavButtons = ["Main Profile"];

      setupRouter(router, queryClient);

      expect(screen.getByText("User Settings")).toBeInTheDocument();

      const leftNav = screen.getByLabelText("left-navigation");
      const rightNav = screen.getByLabelText("right-navigation");

      expect(leftNav).toBeInTheDocument();
      expect(rightNav).toBeInTheDocument();

      leftNavButtons.forEach((name) => {
        expect(within(leftNav).getByRole("button", { name })).toBeInTheDocument();
      });

      rightNavButtons.forEach((name) => {
        expect(within(rightNav).getByRole("button", { name })).toBeInTheDocument();
      });

      nonActiveNavButtons.forEach((name) => {
        expect(within(rightNav).queryByRole("button", { name })).not.toBeInTheDocument();
      });

      expect(screen.getByTestId("spinner")).toBeInTheDocument();

      await waitFor(() => {
        const user = queryClient.getQueryData(getAuthUserQueryOptions().queryKey);

        expect(user).toBeTruthy();

        const { username } = user;
        const { displayName } = user.profile;

        expect(screen.getByText(`${username}`)).toBeInTheDocument();
        expect(screen.getByAltText(`${displayName || username}'s avatar`)).toBeInTheDocument();
        expect(screen.getByAltText("Profile background")).toBeInTheDocument();
        expect(screen.getByTestId("edit-username")).toBeInTheDocument();
      });
    });

    it("renders the 'Profiles' section and its default right tab when clicked", async () => {
      const { user: userEvent } = setupRouter(router, queryClient);

      const profilesTab = screen.getByRole("button", { name: "Profiles" });

      await userEvent.click(profilesTab);

      const user = queryClient.getQueryData(getAuthUserQueryOptions().queryKey);

      expect(user).toBeTruthy();

      const { username } = user;
      const { displayName } = user.profile;

      expect(screen.getByText(`${username}`)).toBeInTheDocument();

      expect(
        screen.getByAltText(`${displayName || username}'s nameplate avatar`)
      ).toBeInTheDocument();
      expect(screen.getByAltText(`${displayName || username}'s avatar`)).toBeInTheDocument();
      expect(screen.getByAltText("Profile background")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Example Button" })).toBeInTheDocument();
      expect(screen.getByLabelText("Display Name")).toBeInTheDocument();
      expect(screen.getByLabelText("About Me")).toBeInTheDocument();
      expect(screen.getAllByText("Change Avatar")).toHaveLength(2);
    });

    it("renders the username form when the user clicks the edit username button", async () => {
      const { user } = setupRouter(router, queryClient);

      await user.click(screen.getByTestId("edit-username"));

      expect(screen.getByRole("form")).toBeInTheDocument();
    });

    it("renders the confirmation dialog when the user has made changes", async () => {
      const { valid } = form;

      const { user } = setupRouter(router, queryClient);

      await user.click(screen.getByRole("button", { name: "Profiles" }));

      await user.type(screen.getByLabelText("Display Name"), valid.displayName);
      await user.tab();

      expect(screen.getByRole("button", { name: "Save Changes" })).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("shows an error message when the username is invalid", async () => {
      const { invalid } = form;
      const { user } = setupRouter(router, queryClient);

      await user.click(screen.getByTestId("edit-username"));
      await user.type(screen.getByLabelText("Username"), invalid.username);
      await user.tab(); // triggers blur

      expect(
        screen.getByText(
          "Username can only contain letters (A-Z, a-z), numbers (0-9), and the characters: _ , ."
        )
      ).toBeInTheDocument();
    });

    it("shows an error message when the display name is invalid", async () => {
      const { invalid } = form;
      const { user } = setupRouter(router, queryClient);

      await user.click(screen.getByRole("button", { name: "Profiles" }));

      await user.type(screen.getByLabelText("Display Name"), invalid.displayName);
      await user.tab();

      expect(screen.getByText("String must contain at most 36 character(s)")).toBeInTheDocument();
    });

    it("shows an error message when the password is invalid", async () => {
      const { invalid } = form;

      const { user } = setupRouter(router, queryClient);

      await user.click(screen.getByTestId("edit-password"));

      await user.type(screen.getByLabelText("Old Password"), invalid.password);
      await user.type(screen.getByLabelText("New Password"), invalid.password);

      expect(
        screen.getByText(
          "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number and no spaces"
        )
      ).toBeInTheDocument();
    });
  });

  describe("Submission Errors", () => {
    it("shows an error when the old password is incorrect", async () => {
      const { valid, notFound } = form;

      const { user } = setupRouter(router, queryClient);

      await user.click(screen.getByTestId("edit-password"));

      await user.type(screen.getByLabelText("Old Password"), notFound.password);
      await user.type(screen.getByLabelText("New Password"), valid.newPassword);
      await user.type(screen.getByLabelText("Confirm Password"), valid.newPassword);

      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() => {
        expect(screen.getByText("The old password provided is incorrect")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
      });
    });
  });

  describe("Success Case", () => {
    it("submits the updated display name and refetches the user data", async () => {
      const { valid } = form;

      const { user } = setupRouter(router, queryClient);

      await user.click(screen.getByRole("button", { name: "Profiles" }));

      const input = screen.getByLabelText("Display Name");

      await user.clear(input);

      await user.type(input, valid.displayName);
      await user.click(screen.getByRole("button", { name: "Save Changes" }));

      await waitFor(() => {
        expect(
          queryClient.isFetching({ queryKey: getAuthUserQueryOptions().queryKey })
        ).toBeGreaterThan(0);
      });

      await waitFor(() => {
        expect(queryClient.isFetching({ queryKey: getAuthUserQueryOptions().queryKey })).toBe(0);
        expect(screen.queryByRole("button", { name: "Save Changes" })).not.toBeInTheDocument();
        expect(
          screen.getByRole("heading", { level: 3, name: valid.displayName })
        ).toBeInTheDocument();
      });
    });

    it("submits the updated username and refetches the user data", async () => {
      const { valid } = form;

      const { user } = setupRouter(router, queryClient);

      await user.click(screen.getByTestId("edit-username"));

      const input = screen.getByLabelText("Username");

      await user.type(input, valid.username);
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(async () => {
        expect(
          queryClient.isFetching({ queryKey: getAuthUserQueryOptions().queryKey })
        ).toBeGreaterThan(0);
      });

      await waitFor(() => {
        expect(queryClient.isFetching({ queryKey: getAuthUserQueryOptions().queryKey })).toBe(0);
        expect(screen.queryByRole("button", { name: "Submit" })).not.toBeInTheDocument();

        const section = screen.getByTestId("username");

        expect(within(section).getByText(valid.username)).toBeInTheDocument();
      });
    });

    it("logs out and redirects the user to /login after a password change", async () => {
      const { valid } = form;

      const { user } = setupRouter(router, queryClient);

      await user.click(screen.getByTestId("edit-password"));

      await user.type(screen.getByLabelText("Old Password"), valid.oldPassword);
      await user.type(screen.getByLabelText("New Password"), valid.newPassword);
      await user.type(screen.getByLabelText("Confirm Password"), valid.newPassword);

      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() => {
        expect(queryClient.getQueryData(getAuthUserQueryOptions().queryKey)).toBeUndefined();
        expect(getToken()).toBeNull();
        expect(screen.getByText("Login Page")).toBeInTheDocument();
      });
    });
  });
});
