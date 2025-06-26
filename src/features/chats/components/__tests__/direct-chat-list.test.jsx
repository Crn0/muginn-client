import { QueryClient } from "@tanstack/react-query";
import { createMemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { screen } from "@testing-library/react";

import { db } from "../../../../test/mocks";
import { paths } from "../../../configs";
import { getChatsQueryOptions } from "../api/get-chats";
import { createChats } from "./data";
import { setupRouter } from "./mocks/utils/setup";
import DirectChatList from "../components/direct-chat-list";
import { RouteErrorElement } from "../../../components/errors";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { enabled: false },
  },
});

let user;
let chats;

const router = createMemoryRouter(
  [
    {
      path: paths.dashboard.getHref(),
      errorElement: <RouteErrorElement />,
      element: <DirectChatList />,
    },
  ],
  { initialEntries: [paths.dashboard.getHref()] }
);

beforeAll(() => {
  const { queryKey } = getChatsQueryOptions();

  user = db.user.findFirst({ where: { username: { equals: ".crno." } } });

  chats = createChats({ ownerId: user.id, type: "DirectChat", length: 10 });

  queryClient.setQueryData(queryKey, chats);

  return () => queryClient.removeQueries({ queryKey: getChatsQueryOptions().queryKey });
});

afterEach(() => {});

describe("DirectChat List", () => {
  it("renders the users' direct chats", () => {
    setupRouter(router, queryClient);

    expect(screen.getAllByRole("link").length).toBe(chats.length);
  });

  it("renders a fallback image if there's no avatar", () => {
    setupRouter(router, queryClient);

    chats.forEach((chat) =>
      expect(screen.getByAltText(`Direct chat ${chat.id}`)).toBeInTheDocument()
    );
  });
});
