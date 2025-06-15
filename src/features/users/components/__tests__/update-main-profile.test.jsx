import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import UpdateUserMainProfile from "../update-main-profile";
import { userData } from "./data";
import { paths } from "../../../../configs";

const router = createMemoryRouter(
  [
    {
      path: paths.user.userSettings.getHref(),
      element: <UpdateUserMainProfile user={userData} />,
    },
  ],
  { initialEntries: [paths.user.userSettings.getHref()] }
);

const renderRouteComponent = () => render(<RouterProvider router={router} />);

describe("User Main Profile Form", () => {
  it("renders the user profile form", () => {
    renderRouteComponent();

    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByLabelText("Display Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Display Name").value).toBe(userData.profile.displayName);
    expect(screen.getAllByLabelText("Change Avatar")).toHaveLength(2);
    expect(screen.getByText("Background Avatar")).toBeInTheDocument();
    expect(screen.getByText("Avatar")).toBeInTheDocument();
    expect(screen.getByLabelText("About Me")).toBeInTheDocument();
    expect(screen.getByLabelText("About Me").value).toBe(userData.profile.aboutMe);
  });

  it("renders the user profiles' preview", () => {
    renderRouteComponent();

    expect(screen.getByTestId("user-profile-preview")).toBeInTheDocument();
    expect(screen.getByAltText("crno's avatar")).toBeInTheDocument();
    expect(screen.getByAltText("Profile background")).toBeInTheDocument();
    expect(screen.getByAltText("crno's nameplate avatar")).toBeInTheDocument();
  });
});
