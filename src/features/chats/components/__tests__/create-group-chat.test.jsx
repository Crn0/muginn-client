import { QueryClient } from "@tanstack/react-query";
import { createMemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";

import { paths } from "../../../configs";
import { setupRouter } from "./mocks/utils/setup";
import CreateGroupChat from "../components/create-group-chat";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { enabled: false },
  },
});

const routes = [
  {
    path: paths.dashboard.getHref(),
    element: <CreateGroupChat />,
  },
];

describe("GroupChat Creation", () => {
  it("renders the form dialog trigger", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: [paths.dashboard.getHref()],
    });

    setupRouter(router, queryClient);

    expect(screen.getByTestId("chat-form-trigger")).toBeInTheDocument();
  });

  it("renders the form when the user clicked the trigger button", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: [paths.dashboard.getHref()],
    });

    const { user } = setupRouter(router, queryClient);

    await user.click(screen.getByTestId("chat-form-trigger"));

    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByTestId("chat-form-submit")).toBeInTheDocument();
    expect(screen.getByTestId("chat-form-cancel")).toBeInTheDocument();
    expect(screen.getByLabelText("Chat Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Upload Avatar")).toBeInTheDocument();
  });
});
