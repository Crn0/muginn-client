import { QueryClient } from "@tanstack/react-query";
import { createMemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeAll } from "vitest";
import { screen } from "@testing-library/react";

import { paths } from "@/configs";
import { getChatsQueryOptions, type TChat } from "../../api";
import { createChats } from "./data";
import { setupRouter } from "./mocks/utils/setup";
import { RouteErrorElement } from "@/components/errors";
import { DirectChatList } from "..";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { enabled: false },
  },
});

const chats: TChat[] = [];

const router = createMemoryRouter(
  [
    {
      path: paths.protected.dashboard.me.getHref(),
      errorElement: <RouteErrorElement />,
      element: <DirectChatList />,
    },
  ],
  { initialEntries: [paths.protected.dashboard.me.getHref()] }
);

beforeAll(() => {
  const { queryKey } = getChatsQueryOptions();

  chats.push(...createChats({ type: "DirectChat", length: 10, isPrivate: false }));

  queryClient.setQueryData(queryKey, chats);

  return () => queryClient.removeQueries({ queryKey: getChatsQueryOptions().queryKey });
});

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
