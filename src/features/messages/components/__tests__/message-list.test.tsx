import { QueryClient } from "@tanstack/react-query";
import { describe, it, expect, beforeEach } from "vitest";
import { screen, within } from "@testing-library/react";

import { getInfiniteMessagesQueryOptions } from "../../api";
import { generateId } from "@/lib";
import { createMessages } from "./mocks/data";
import { renderComponent } from "./mocks/utils/setup";
import { MessageList } from "..";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, enabled: false } },
});

const chatId = generateId();

const { queryKey } = getInfiniteMessagesQueryOptions(chatId);

const messages = createMessages({});

beforeEach(async () => {
  queryClient.setQueryData(queryKey, {
    pages: [{ messages, pagination: { prevHref: null, nextHref: null } }],
    pageParams: [],
  });
});

describe("Message List", () => {
  it("should render a list of messages", () => {
    renderComponent(<MessageList chatId={chatId} />, queryClient);

    const ul = screen.queryByLabelText("messages");

    expect(ul).toBeInTheDocument();

    const listItems = within(ul).queryAllByRole("listitem");

    expect(listItems.length).toBe(messages.length);
  });

  it("should render the messages user avatar, created date, content and attachments", () => {
    renderComponent(<MessageList chatId={chatId} />, queryClient);

    messages.forEach((message) => {
      expect(
        screen.queryByRole("img", {
          name: `${message.user.profile.displayName || message.user.username}'s avatar`,
        })
      ).toBeInTheDocument();

      expect(screen.queryByText(message.content)).toBeInTheDocument();

      message.attachments.forEach((attachment) =>
        expect(screen.queryByRole("img", { name: attachment.id })).toBeInTheDocument()
      );
    });

    expect(screen.queryAllByRole("time").length).toBe(messages.length);
  });

  it("should render the load more messages button when there's a next page", () => {
    queryClient.setQueryData(queryKey, {
      pages: [
        {
          messages,
          pagination: {
            prevHref: null,
            nextHref: `http://localhost:3000/api/v1/chats/${generateId()}/messages?after=${generateId()}`,
          },
        },
      ],
      pageParams: [],
    });

    renderComponent(<MessageList chatId={chatId} />, queryClient);

    expect(screen.queryByTestId("load-next-page")).toBeInTheDocument();
  });
});
