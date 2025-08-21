import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { createMessages } from "./mocks/data";
import { Message } from "..";

describe("Message Component", () => {
  it("should render the messages user avatar, created date, content and attachments", () => {
    const message = createMessages({ length: 1 })[0];

    render(<Message message={message} />);

    expect(
      screen.queryByRole("img", {
        name: `${message.user.profile.displayName || message.user.username}'s avatar`,
      })
    ).toBeInTheDocument();

    expect(screen.queryByText(message.content)).toBeInTheDocument();

    message.attachments.forEach((attachment) =>
      expect(screen.queryByRole("img", { name: attachment.id })).toBeInTheDocument()
    );

    expect(screen.queryByRole("time")).toBeInTheDocument();
  });
});
