import { createMemoryRouter, Outlet } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { setupRouter } from "./mocks/utils/setup-router";
import { useGetUser } from "@/lib/auth";
import { getChatsQueryOptions, type TChat } from "@/features/chats/api";
import { paths } from "@/configs/index";
import { setToken } from "@/stores";
import { generateAccessToken } from "../../../test/utils/data-generator";
import { getChat } from "./data";
import { Spinner } from "@/components/ui/spinner";
import { ChatSettingsPage } from "..";

function Protected() {
  const userQuery = useGetUser();

  if (userQuery.isLoading) return <Spinner />;

  return <Outlet />;
}

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

let chat: TChat;

const routes = [
  {
    path: paths.protected.root.path,
    element: (
      <QueryClientProvider client={queryClient}>
        <Protected />
      </QueryClientProvider>
    ),
    children: [
      {
        path: paths.protected.chatSettings.path,
        element: <ChatSettingsPage />,
      },
    ],
  },
  {
    path: paths.login.path,
    element: <p>Login Page</p>,
  },
];

const createRouter = (chatId: string) =>
  createMemoryRouter(routes, {
    initialEntries: [paths.protected.chatSettings.getHref({ chatId })],
  });

beforeEach(() => {
  setToken(generateAccessToken(".crno."));

  chat = getChat(".crno.");
});

describe("Chat Settings Page", () => {
  const form = {
    valid: {
      name: "_crno_group_chat",
      avatar: new File(["hello"], "hello.png", { type: "image/png" }),
    },
  };

  describe("UI Rendering", () => {
    it("renders the chat settings page with the default tab", async () => {
      const leftNavButtons = ["Chat Profile"];
      const rightNavButtons = ["Profile"];

      setupRouter(createRouter(chat.id), queryClient);

      expect(screen.getByTestId("spinner")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("Chat Settings")).toBeInTheDocument();

        const leftNav = screen.getByLabelText("left-navigation");
        const rightNav = screen.getByLabelText("right-navigation");

        expect(leftNav).toBeInTheDocument();
        expect(rightNav).toBeInTheDocument();

        leftNavButtons.forEach((name) => {
          expect(within(leftNav).getByRole("button", { name })).toBeInTheDocument();
        });
        rightNavButtons.forEach((name) => {
          expect(within(rightNav).getByRole("button", { name })).toBeInTheDocument();
        });
      });

      await waitFor(() => {
        const { name } = chat;

        expect(name).toBeTruthy();

        expect(screen.getByText(name as string)).toBeInTheDocument();
      });
    });

    it("renders the confirmation dialog when the user has made changes", async () => {
      const { valid } = form;

      const { user } = setupRouter(createRouter(chat.id), queryClient);

      await user.type(screen.getByLabelText("Name"), valid.name);
      await user.tab();

      expect(screen.getByRole("button", { name: "Save Changes" })).toBeInTheDocument();
    });
  });

  describe("Success Case", () => {
    it("submits the updated name and refetches the chat data", async () => {
      const { valid } = form;

      const { user } = setupRouter(createRouter(chat.id), queryClient);

      await user.click(screen.getByRole("button", { name: "Profile" }));

      const input = screen.getByLabelText("Name");

      await user.clear(input);

      await user.type(input, valid.name);
      await user.click(screen.getByRole("button", { name: "Save Changes" }));

      await waitFor(() => {
        expect(
          queryClient.isFetching({ queryKey: getChatsQueryOptions().queryKey })
        ).toBeGreaterThan(0);
      });

      await waitFor(() => {
        expect(queryClient.isFetching({ queryKey: getChatsQueryOptions().queryKey })).toBe(0);
        expect(screen.queryByRole("button", { name: "Save Changes" })).not.toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 3, name: valid.name })).toBeInTheDocument();
      });
    });
  });
});
