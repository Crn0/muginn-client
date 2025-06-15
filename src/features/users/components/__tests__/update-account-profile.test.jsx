import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";

import UpdateAccountProfile from "../update-account-profile";
import { userData as user } from "./data";
import { paths } from "../../../../configs";

const router = createMemoryRouter(
  [
    {
      path: paths.user.userSettings.getHref(),
      element: <UpdateAccountProfile user={user} />,
    },
  ],
  { initialEntries: [paths.user.userSettings.getHref()] }
);

const renderRouteComponent = () => render(<RouterProvider router={router} />);

describe("Account Profile", () => {
  it("renders the account profile", () => {
    renderRouteComponent();

    expect(screen.getByAltText("Profile background")).toBeInTheDocument();
    expect(
      screen.getByAltText(`${user.profile.displayName || user.username}'s avatar`)
    ).toBeInTheDocument();
    expect(screen.getByTestId("username-info")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit User Profile" })).toBeInTheDocument();

    const displayNameSection = screen.getByTestId("display-name");

    expect(within(displayNameSection).getByText("Display Name")).toBeInTheDocument();
    expect(
      within(displayNameSection).getByText(user.profile.displayName || user.username)
    ).toBeInTheDocument();
    expect(within(displayNameSection).getByTestId("edit-display-name")).toBeInTheDocument();

    const usernameSection = screen.getByTestId("username");

    expect(within(usernameSection).getByText("Username")).toBeInTheDocument();
    expect(within(usernameSection).getByText(user.username)).toBeInTheDocument();
    expect(within(usernameSection).getByTestId("edit-username")).toBeInTheDocument();

    const emailSection = screen.getByTestId("email");

    expect(within(emailSection).getByText("Email")).toBeInTheDocument();
    expect(within(emailSection).getByText(user.email)).toBeInTheDocument();
    expect(within(emailSection).getByTestId("edit-email")).toBeInTheDocument();

    const passwordAndAuthSection = screen.getByTestId("password-auth");

    expect(
      within(passwordAndAuthSection).getByText("Password and Authentication")
    ).toBeInTheDocument();
    expect(within(passwordAndAuthSection).getByTestId("edit-password")).toBeInTheDocument();
  });
});
