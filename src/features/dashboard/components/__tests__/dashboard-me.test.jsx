import { QueryClient } from "@tanstack/react-query";
import { createMemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeAll } from "vitest";
import { screen, within } from "@testing-library/react";

import { paths } from "../../../../configs";
import { getChatsQueryOptions } from "../../../chats/api/get-chats";
import { createChats } from "./data";
import { setupRouter } from "./mocks/utils/setup";
import { RouteErrorElement } from "../../../../components/errors";
import DashBoardMe from "../dashboard-me";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const chats = createChats({
  type: "DirectChat",
  length: 5,
});

const router = createMemoryRouter(
  [
    {
      path: paths.protected.dashboard.me.getHref(),
      errorElement: <RouteErrorElement />,
      element: <DashBoardMe />,
    },
  ],
  { initialEntries: [paths.protected.dashboard.me.getHref()] }
);

beforeAll(() => {
  queryClient.setQueryData(getChatsQueryOptions().queryKey, chats);
});

describe("Dashboard Me", () => {
  it("renders the list of user's direct chat links", () => {
    setupRouter(router, queryClient);

    const container = screen.getByTestId("direct-chat-list");

    expect(container).toBeInTheDocument();

    expect(within(container).getAllByRole("link").length).toBe(chats.length);
  });
});
