import { QueryClient } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import { faker } from "@faker-js/faker";

import { renderComponent } from "./mocks/utils/setup";
import { createChats } from "./mocks/data";
import CreateMessage from "../create-message";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const chat = createChats({ ownerId: faker.string.uuid(), length: 1 })[0];

describe("Message Creation", () => {
  it("should render the Form component with input text and drop menu button", () => {
    renderComponent(<CreateMessage chatId={chat.id} />, queryClient);

    const form = screen.getByRole("form");

    expect(within(form).getByRole("textbox")).toBeInTheDocument();
    expect(within(form).getByTestId("drop-down-trigger")).toBeInTheDocument();
  });
});
