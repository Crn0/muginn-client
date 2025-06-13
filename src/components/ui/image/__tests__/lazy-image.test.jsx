import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";

import LazyImage from "../lazy-image";

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

const fallBackAsset = {
  image: faker.image.avatarGitHub(),
  lazyImage: faker.image.dataUri(),
};

describe("LazyImage Component", () => {
  it("should render asset image when it is provided", () => {
    render(<LazyImage asset={asset} fallBackAsset={fallBackAsset} alt='lazy-image-test' />);

    expect(screen.getByAltText("lazy-image-test")).toBeInTheDocument();
    expect(screen.getByAltText("lazy-image-test").src).toBe(asset.url);
  });

  it("should render a fallback images if there is no asset provided", () => {
    render(<LazyImage fallBackAsset={fallBackAsset} alt='lazy-image-test' />);

    expect(screen.getByAltText("lazy-image-test")).toBeInTheDocument();
    expect(screen.getByAltText("lazy-image-test").src).toBe(fallBackAsset.image);
  });
});
