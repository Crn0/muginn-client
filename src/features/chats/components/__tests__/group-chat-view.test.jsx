import { QueryClient } from "@tanstack/react-query";
import { createMemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { faker } from "@faker-js/faker";

import { paths } from "../../../../configs";
import { getChatQueryOptions } from "../../api/get-chat";
import { createChats } from "./data";
import { setupRouter } from "./mocks/utils/setup";
import GroupChatView from "../group-chat-view";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const chat = createChats({
  ownerId: faker.string.uuid(),
  nameTemplate: "test-chat-",
  length: 1,
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
  it("renders a alternative text if there's no existing chat", async () => {
    queryClient.setQueryData(getChatQueryOptions(chat.id).queryKey, null);

    setupRouter(router, queryClient);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
