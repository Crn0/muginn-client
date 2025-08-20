import { QueryClient } from "@tanstack/react-query";
import { createMemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";

import { paths } from "@/configs";
import { setupRouter } from "./mocks/utils/setup";
import { JoinGroupChat } from "..";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { enabled: false },
  },
});

const routes = [
  {
    path: paths.protected.dashboard.me.getHref(),
    element: (
      <>
        <div id='dashboard-main' />
        <JoinGroupChat />
      </>
    ),
  },
];

describe("GroupChat Entry", () => {
  it("renders the form dialog trigger", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: [paths.protected.dashboard.me.getHref()],
    });

    setupRouter(router, queryClient);

    expect(screen.getByTestId("join-chat-form-trigger")).toBeInTheDocument();
  });

  it("renders the form when the user clicked the trigger button", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: [paths.protected.dashboard.me.getHref()],
    });

    const { user } = setupRouter(router, queryClient);

    await user.click(screen.getByTestId("join-chat-form-trigger"));

    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByTestId("join-chat-form-submit")).toBeInTheDocument();
    expect(screen.getByTestId("join-chat-form-cancel")).toBeInTheDocument();
    expect(screen.getByLabelText("Invite ID")).toBeInTheDocument();
  });
});
