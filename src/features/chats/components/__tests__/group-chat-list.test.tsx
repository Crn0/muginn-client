import { QueryClient } from "@tanstack/react-query";
import { createMemoryRouter } from "react-router-dom";
import { describe, it, expect, afterEach } from "vitest";
import { screen } from "@testing-library/react";

import { db } from "../../../../../test/mocks";
import { paths } from "@/configs";
import { getChatsQueryOptions } from "../../api";
import { createChats } from "./data";
import { setupRouter } from "./mocks/utils/setup";
import { RouteErrorElement } from "@/components/errors";
import { GroupChatList } from "..";
import { DashboardDrawerContext } from "@/components/layouts/context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { enabled: false },
  },
});

const user = db.user.findFirst({ where: { username: { equals: ".crno." } } });

const router = createMemoryRouter(
  [
    {
      path: paths.protected.dashboard.me.getHref(),
      errorElement: <RouteErrorElement />,
      element: (
        <DashboardDrawerContext.Provider
          value={{
            isAutoDrawer: false,
            isDrawerOpen: false,
            clientWidth: null,
            open: () => {},
            close: () => {},
            toggle: () => {},
            auto: () => {},
            manual: () => {},
          }}
        >
          <GroupChatList />
        </DashboardDrawerContext.Provider>
      ),
    },
  ],
  { initialEntries: [paths.protected.dashboard.me.getHref()] }
);

afterEach(() => {
  queryClient.removeQueries({ queryKey: getChatsQueryOptions().queryKey });
});

describe("GroupChat List", () => {
  const { queryKey } = getChatsQueryOptions();

  it("renders the users' group chats", () => {
    const chats = createChats({
      ownerId: user?.id,
      length: 10,
      isPrivate: false,
      type: "GroupChat",
    });

    queryClient.setQueryData(queryKey, chats);

    setupRouter(router, queryClient);

    expect(screen.getAllByRole("link").length).toBe(chats.length);
  });

  it("renders the chat names initials when there's no avatar", () => {
    const chats = createChats({
      ownerId: user?.id,
      length: 10,
      isPrivate: false,
      type: "GroupChat",
    });

    queryClient.setQueryData(queryKey, chats);

    setupRouter(router, queryClient);

    chats.forEach((chat) =>
      chat.name?.[0] ? expect(screen.getByText(chat.name[0])).toBeInTheDocument() : null
    );
  });

  it("renders the initials with hyphens when it contains them", () => {
    const chats = createChats({
      ownerId: user?.id,
      nameTemplate: "test-chat-",
      length: 10,
      isPrivate: false,
      type: "GroupChat",
    });

    queryClient.setQueryData(queryKey, chats);

    setupRouter(router, queryClient);

    const linkTexts = chats.map((chat) =>
      chat?.name
        ?.split(/[- ]+/)
        .map((n) => n[0])
        .join(chat.name.includes("-") ? "-" : "")
    );

    linkTexts.forEach((text) => (text ? expect(screen.getByText(text)).toBeInTheDocument() : null));
  });
});
