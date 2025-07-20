import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";

import LazyImage from "../lazy-image";

const asset = {
  mainImage: faker.image.avatarGitHub(),
  lazyImage: faker.image.dataUri(),
};

describe("LazyImage Component", () => {
  it("should render image when it is provided", () => {
    render(
      <LazyImage mainImage={asset.mainImage} lazyImage={asset.lazyImage} alt='lazy-image-test' />
    );

    expect(screen.getByAltText("lazy-image-test")).toBeInTheDocument();
    expect(screen.getByAltText("lazy-image-test").src).toBe(asset.mainImage);
  });
});
