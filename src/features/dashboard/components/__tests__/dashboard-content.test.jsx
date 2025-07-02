import { ErrorBoundary } from "react-error-boundary";
import { QueryClient } from "@tanstack/react-query";
import { createMemoryRouter } from "react-router-dom";
import { describe, it, expect, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";

import { paths } from "../../../../configs";
import { getChatQueryOptions } from "../../../chats/api/get-chat";
import { getChatsQueryOptions } from "../../../chats/api/get-chats";
import { createChats } from "./data";
import { setupRouter } from "./mocks/utils/setup";
import { ErrorElement } from "../../../../components/errors";
import { ContentLayout } from "../../../../components/layouts";
import DirectChatList from "../../../chats/components/direct-chat-list";
import GroupChatView from "../../../chats/components/group-chat-view";
import DashboardContent from "../dashboard-content";
import DashBoardMe from "../dashboard-me";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

afterEach(() => {
  queryClient.clear();
});

describe("Dashboard Content", () => {
  it("renders the DirectChatList component when the path is /chats/me", () => {
    const chats = createChats({
      ownerId: faker.string.uuid(),
      isPrivate: true,
      type: "DirectChat",
      length: 5,
    });

    queryClient.setQueryData(getChatsQueryOptions().queryKey, chats);

    const router = createMemoryRouter(
      [
        {
          path: paths.dashboard.root.path,
          element: (
            <ErrorBoundary FallbackComponent={ErrorElement}>
              <DashboardContent />
            </ErrorBoundary>
          ),
          children: [
            {
              path: paths.dashboard.me.path,
              element: <DashBoardMe />,
            },
          ],
        },
      ],
      { initialEntries: [`${paths.dashboard.root.path}/me`] }
    );

    setupRouter(router, queryClient);

    expect(screen.getAllByRole("link").length).toBe(chats.length);
  });

  it("renders the GroupChatView component when the path is /chats/:chatId", () => {
    const chat = createChats({
      ownerId: faker.string.uuid(),
      nameTemplate: "group-chat-",
      type: "GroupChat",
      length: 1,
    })[0];

    queryClient.setQueryData(getChatQueryOptions(chat.id).queryKey, chat);

    const router = createMemoryRouter(
      [
        {
          path: paths.dashboard.root.path,
          element: (
            <ErrorBoundary FallbackComponent={ErrorElement}>
              <DashboardContent />
            </ErrorBoundary>
          ),
          children: [
            {
              path: paths.dashboard.groupChat.path,
              element: <GroupChatView />,
            },
          ],
        },
      ],
      { initialEntries: [paths.dashboard.groupChat.getHref(chat.id)] }
    );

    setupRouter(router, queryClient);

    expect(screen.getByAltText(`${chat.name}'s avatar`)).toBeInTheDocument();
    expect(screen.getByTestId("leave-chat-form-trigger")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: chat.name })).toBeInTheDocument();
    expect(screen.getByRole("note")).toBeInTheDocument();
  });
});
