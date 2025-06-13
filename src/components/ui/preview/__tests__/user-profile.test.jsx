import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";

import UserProfilePreview from "../user-profile";

const renderProfileButton = () => <button type='button'>Example Button</button>;

const user = {
  username: faker.internet.username(),
  profile: {
    displayName: faker.internet.displayName(),
    aboutMe: faker.person.bio(),
    avatar: {
      url: faker.image.avatar(),
      images: [
        {
          url: faker.image.avatar(),
          format: "jpg",
          size: 300,
        },
      ],
    },
    backgroundAvatar: {
      url: faker.image.avatar(),
      images: [
        {
          url: faker.image.avatar(),
          format: "jpg",
          size: 300,
        },
      ],
    },
  },
};

describe("UserProfilePreview Component", () => {
  it("should render the user's profile", () => {
    render(<UserProfilePreview user={user} renderProfileButton={renderProfileButton} />);

    expect(screen.getByText(user.username)).toBeInTheDocument();
    expect(screen.getByText(user.profile.displayName)).toBeInTheDocument();
    expect(screen.getByText(user.profile.aboutMe)).toBeInTheDocument();
    expect(screen.getByAltText(`${user.profile.displayName}'s avatar`)).toBeInTheDocument();
    expect(screen.getByAltText("Profile background")).toBeInTheDocument();
    expect(screen.getByText("Example Button")).toBeInTheDocument();
  });
});
