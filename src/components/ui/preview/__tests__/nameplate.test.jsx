import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";

import NameplatePreview from "../nameplate";

const username = faker.internet.username();
const displayName = faker.internet.displayName();

const asset = {
  url: faker.image.avatar(),
  images: [
    {
      url: faker.image.avatar(),
      format: "jpg",
      size: 300,
    },
  ],
};

describe("NameplatePreview Component", () => {
  it("should render the users' display name and avatar", () => {
    render(<NameplatePreview username={username} displayName={displayName} asset={asset} />);

    expect(screen.getByText(displayName)).toBeInTheDocument();
    expect(screen.getByAltText(`${displayName}'s avatar`)).toBeInTheDocument();
    expect(screen.getByAltText(`${displayName}'s avatar`).src).toBe(asset.url);
  });

  it("should render the users' username when display name is falsy and avatar", () => {
    render(<NameplatePreview username={username} displayName='' asset={asset} />);

    expect(screen.getByText(username)).toBeInTheDocument();
    expect(screen.getByAltText(`${username}'s avatar`)).toBeInTheDocument();
    expect(screen.getByAltText(`${username}'s avatar`).src).toBe(asset.url);
  });
});
