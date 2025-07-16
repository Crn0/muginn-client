import { createMemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { faker } from "@faker-js/faker";

import { paths } from "../../configs/index";
import { getAuthUserQueryOptions } from "../../lib/auth";
import { getChatQueryOptions, getChatsQueryOptions } from "../../features/chats/api";
import { generateAccessToken } from "../../../test/utils/data-generator";
import { createChats } from "./data";
import { setToken } from "../../stores";
import setupRouter from "./mocks/utils/setup-router";
import DashBoard from "../dashboard";
import GroupChatView from "../../features/chats/components/group-chat-view";
import DashBoardMe from "../../features/dashboard/components/dashboard-me";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const groupChat = createChats({
  ownerId: faker.string.uuid(),
  nameTemplate: "group-chat-",
  type: "GroupChat",
  length: 5,
});

const directChat = createChats({ type: "DirectChat", length: 5 });

const chats = [...groupChat, ...directChat];

const routes = [
  {
    path: paths.protected.dashboard.root.getHref(),
    element: (
      <QueryClientProvider client={queryClient}>
        <DashBoard />
      </QueryClientProvider>
    ),
    children: [
      {
        index: paths.protected.dashboard.me.path,
        element: <DashBoardMe />,
      },
      {
        path: paths.protected.dashboard.groupChat.path,
        element: <GroupChatView />,
      },
      {
        path: paths.protected.dashboard.me.path,
        element: <DashBoardMe />,
      },
    ],
  },
];

beforeAll(() => {
  queryClient.setQueryData(getAuthUserQueryOptions().queryKey, {
    id: "de3362a4-e71f-4e33-a212-f7b981bbc773",
    username: ".crno.",
    email: null,
    accountLevel: 1,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    lastSeenAt: new Date().toISOString(),
    profile: {
      avatar: null,
      backgroundAvatar: null,
      displayName: "_crno_",
      aboutMe: "",
    },
  });
});

beforeEach(() => {
  queryClient.setQueryData(getChatsQueryOptions().queryKey, chats);
});

describe("Dashboard page", () => {
  describe("UI Rendering", () => {
    it("renders a group chats sidebar and a direct chats panel in the main content on '/chats'", () => {
      const router = createMemoryRouter(routes, {
        initialEntries: [paths.protected.dashboard.me.getHref()],
      });

      setupRouter(router, queryClient);

      const groupChatContainer = screen.getByTestId("group-chat-list");
      const directChatContainer = screen.getByTestId("direct-chat-list");

      expect(groupChatContainer).toBeInTheDocument();
      expect(directChatContainer).toBeInTheDocument();

      expect(screen.getByRole("heading", { level: 1, name: "dashboard" })).toBeInTheDocument();
      expect(within(groupChatContainer).getAllByRole("link").length).toBe(groupChat.length);
      expect(within(directChatContainer).getAllByRole("link").length).toBe(directChat.length);
      expect(screen.getByTestId("dialog-trigger")).toBeInTheDocument();
    });

    it("renders a group chats sidebar and a direct chats panel in the main content on '/chats/me'", () => {
      const router = createMemoryRouter(routes, {
        initialEntries: [paths.protected.dashboard.me.getHref()],
      });

      setupRouter(router, queryClient);

      const groupChatContainer = screen.getByTestId("group-chat-list");
      const directChatContainer = screen.getByTestId("direct-chat-list");

      expect(groupChatContainer).toBeInTheDocument();
      expect(directChatContainer).toBeInTheDocument();

      expect(screen.getByRole("heading", { level: 1, name: "dashboard" })).toBeInTheDocument();
      expect(within(groupChatContainer).getAllByRole("link").length).toBe(groupChat.length);
      expect(within(directChatContainer).getAllByRole("link").length).toBe(directChat.length);
      expect(screen.getByTestId("dialog-trigger")).toBeInTheDocument();
    });

    it("renders the GroupViewComponent if the route is /chats/:chaId", () => {
      const chat = groupChat[0];

      queryClient.setQueryData(getChatQueryOptions(chat.id).queryKey, chat);

      const router = createMemoryRouter(routes, {
        initialEntries: [paths.protected.dashboard.groupChat.getHref({ chatId: chat.id })],
      });

      setupRouter(router, queryClient);

      const groupChatContainer = screen.getByTestId("group-chat-list");

      expect(groupChatContainer).toBeInTheDocument();

      expect(screen.getByRole("heading", { level: 1, name: chat.name })).toBeInTheDocument();
      expect(screen.getByAltText(`${chat.name}'s avatar`)).toBeInTheDocument();
      expect(screen.getByTestId("chat-drop-down-trigger")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: chat.name })).toBeInTheDocument();
      expect(screen.getByRole("note")).toBeInTheDocument();
      expect(screen.getByTestId("create-message-form")).toBeInTheDocument();
    });

    it("should open the chat form dialog on open trigger click and close it on cancel trigger click", async () => {
      queryClient.setQueryData(getChatsQueryOptions().queryKey, chats);

      const router = createMemoryRouter(routes, {
        initialEntries: [paths.protected.dashboard.root.getHref()],
      });

      const { user } = setupRouter(router, queryClient);

      await user.click(screen.getByTestId("dialog-trigger"));

      await user.click(screen.getByTestId("create-chat-form-trigger"));

      const form = screen.getByRole("form");

      expect(form).toBeInTheDocument();

      await user.click(screen.getByTestId("create-chat-form-cancel"));

      expect(form).not.toBeInTheDocument();
    });
  });

  describe("GroupChat Creation", () => {
    describe("Success Case", () => {
      it("should create a new group chat on form submit and refetch user's chats", async () => {
        const token = generateAccessToken(".crno.");

        setToken(token);

        const router = createMemoryRouter(routes, {
          initialEntries: [paths.protected.dashboard.root.getHref()],
        });

        const { user } = setupRouter(router, queryClient);

        await user.click(screen.getByTestId("dialog-trigger"));

        await user.click(screen.getByTestId("create-chat-form-trigger"));

        await user.type(screen.getByLabelText("Chat Name"), "crno-group-chat");

        await user.click(screen.getByTestId("create-chat-form-submit"));

        const form = screen.queryByRole("form");
        const spinner = screen.queryByTestId("spinner");

        await waitFor(() => {
          expect(form).toBeInTheDocument();
          expect(spinner).toBeInTheDocument();
        });

        await waitFor(() => {
          expect(form).not.toBeInTheDocument();
          expect(spinner).not.toBeInTheDocument();
          expect(screen.getByText(/c-g-c/i)).toBeInTheDocument();
        });
      });
    });
  });
});
