import { QueryClient } from "@tanstack/react-query";
import { createMemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeAll } from "vitest";
import { screen, within } from "@testing-library/react";
import { faker } from "@faker-js/faker";

import { paths } from "../../../../configs";
import { getChatsQueryOptions } from "../../../chats/api/get-chats";
import { createChats } from "./data";
import { setupRouter } from "./mocks/utils/setup";
import { RouteErrorElement } from "../../../../components/errors";
import { getAuthUserQueryOptions } from "../../../../lib";
import { DashboardDrawerContext } from "../../../../components/layouts/context";
import DashBoardSideBar from "../dashboard-sidebar";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const chats = createChats({
  ownerId: faker.string.uuid(),
  nameTemplate: "group-chat-",
  type: "GroupChat",
  length: 5,
});

const router = createMemoryRouter(
  [
    {
      path: paths.protected.dashboard.me.getHref(),
      errorElement: <RouteErrorElement />,
      element: (
        <DashboardDrawerContext.Provider value={{ close: () => {}, manual: () => {} }}>
          <DashBoardSideBar />
        </DashboardDrawerContext.Provider>
      ),
    },
  ],
  { initialEntries: [paths.protected.dashboard.me.getHref()] }
);

beforeAll(() => {
  queryClient.setQueryData(getAuthUserQueryOptions().queryKey, {
    username: ".crno.",
    profile: {
      displayName: "crno",
      avatar: null,
      backgroundAvatar: null,
    },
  });
  queryClient.setQueryData(getChatsQueryOptions().queryKey, chats);
});

describe("Dashboard sidebar", () => {
  it("renders the list of group chats along with a link to view direct chats, a button to open the dropdown and the user's nameplate", () => {
    setupRouter(router, queryClient);

    const groupChatContainer = screen.queryByTestId("group-chat-list");

    expect(screen.getByTestId("dm")).toBeInTheDocument();
    expect(within(groupChatContainer).getAllByRole("link").length).toBe(chats.length);
    expect(screen.getByTestId("dialog-trigger")).toBeInTheDocument();
  });
});
