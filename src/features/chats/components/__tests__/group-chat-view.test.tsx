import { QueryClient } from "@tanstack/react-query";
import { createMemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { faker } from "@faker-js/faker";

import { paths } from "@/configs";
import { getChatQueryOptions } from "../../api";
import { createChats } from "./data";
import { setupRouter } from "./mocks/utils/setup";
import { GroupChatView } from "..";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const chat = createChats({
  ownerId: faker.string.uuid(),
  nameTemplate: "test-chat-",
  length: 1,
  isPrivate: false,
  type: "GroupChat",
})[0];

const router = createMemoryRouter(
  [
    {
      path: paths.protected.dashboard.root.path,
      children: [
        {
          path: paths.protected.dashboard.groupChat.path,
          element: <GroupChatView />,
        },
      ],
    },
  ],
  { initialEntries: [paths.protected.dashboard.groupChat.getHref({ chatId: chat.id })] }
);

describe("GroupChat View", () => {
  it("renders the chat view", async () => {
    queryClient.setQueryData(getChatQueryOptions(chat.id).queryKey, chat);

    setupRouter(router, queryClient);

    await waitFor(() => {
      expect(screen.getByTestId("spinner")).toBeInTheDocument(); // Spinner for loading chat messages
      expect(screen.getByText(chat.name as string)).toBeInTheDocument();
      expect(screen.getByRole("form")).toBeInTheDocument();
    });
  });

  it("renders a alternative text if there's no existing chat", async () => {
    queryClient.removeQueries({
      queryKey: getChatQueryOptions(chat.id).queryKey,
    });

    setupRouter(router, queryClient);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
