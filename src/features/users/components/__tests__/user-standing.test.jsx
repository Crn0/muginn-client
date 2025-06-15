import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";

import UserStanding from "../user-standing";

const reasons = [
  "Changing your username is not allowed",
  "Changing your email is not allowed",
  "Changing your password is not allowed",
  "Account deletion is not allowed",
];

describe("User Standing", () => {
  it("renders a list of limitation reasons when the current user is a demo account", () => {
    render(<UserStanding accountLevel={0} />);

    const list = screen.getByTestId("limitation-reasons");

    expect(screen.getByText("Features Not Available in Demo:")).toBeInTheDocument();
    expect(list).toBeInTheDocument();

    reasons.forEach((reason) => {
      expect(within(list).getByText(reason)).toBeInTheDocument();
    });

    expect(within(list).getAllByRole("listitem")).toHaveLength(reasons.length);
  });

  it("renders a full access message if the user is a full member", () => {
    render(<UserStanding accountLevel={1} />);

    expect(
      screen.getByText("You are a Full Member with unrestricted access to all features.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Features Not Available in Demo:")).not.toBeInTheDocument();
    expect(screen.queryByTestId("limitation-reasons")).not.toBeInTheDocument();
  });
});
