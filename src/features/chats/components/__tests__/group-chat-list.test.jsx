import { QueryClient } from "@tanstack/react-query";
import { createMemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { screen } from "@testing-library/react";

import { db } from "../../../../../test/mocks";
import { paths } from "../../../../configs";
import { getChatsQueryOptions } from "../../api/get-chats";
import { createChats } from "./data";
import { setupRouter } from "./mocks/utils/setup";
import { RouteErrorElement } from "../../../../components/errors";
import GroupChatList from "../group-chat-list";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { enabled: false },
  },
});

let user;

const router = createMemoryRouter(
  [
    {
      path: paths.dashboard.me.getHref(),
      errorElement: <RouteErrorElement />,
      element: <GroupChatList />,
    },
  ],
  { initialEntries: [paths.dashboard.me.getHref()] }
);

beforeAll(() => {
  user = db.user.findFirst({ where: { username: { equals: ".crno." } } });
});

afterEach(() => {
  queryClient.removeQueries({ queryKey: getChatsQueryOptions().queryKey });
});

describe("GroupChat List", () => {
  const { queryKey } = getChatsQueryOptions();

  it("renders the users' group chats", () => {
    const chats = createChats({ ownerId: user.id, length: 10 });

    queryClient.setQueryData(queryKey, chats);

    setupRouter(router, queryClient);

    expect(screen.getAllByRole("link").length).toBe(chats.length);
  });

  it("renders the chat names initials when there's no avatar", () => {
    const chats = createChats({ ownerId: user.id, length: 10 });

    queryClient.setQueryData(queryKey, chats);

    setupRouter(router, queryClient);

    chats.forEach((chat) => expect(screen.getByText(chat.name[0])).toBeInTheDocument());
  });

  it("renders the initials with hyphens when it contains them", () => {
    const chats = createChats({ ownerId: user.id, nameTemplate: "test-chat-", length: 10 });

    queryClient.setQueryData(queryKey, chats);

    setupRouter(router, queryClient);

    const linkTexts = chats.map((chat) =>
      chat.name
        .split(/[- ]+/)
        .map((n) => n[0])
        .join(chat.name.includes("-") ? "-" : "")
    );

    linkTexts.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
  });
});
