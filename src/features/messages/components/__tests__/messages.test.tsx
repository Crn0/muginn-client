import { QueryClient } from "@tanstack/react-query";
import { describe, it, expect, beforeEach } from "vitest";
import { screen, within } from "@testing-library/react";

import { getInfiniteMessagesQueryOptions } from "../../api/";
import { generateId } from "@/lib";
import { createMessages } from "./mocks/data";
import { renderComponent } from "./mocks/utils/setup";
import { Messages } from "..";

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

describe("Messages", () => {
  it("should render the list of messages and the message creation form", () => {
    renderComponent(<Messages chatId={chatId} />, queryClient);

    const ul = screen.getByLabelText("messages");

    expect(ul).toBeInTheDocument();

    const listItems = within(ul).queryAllByRole("listitem");

    expect(listItems.length).toBe(messages.length);
    expect(screen.queryByRole("form")).toBeInTheDocument();
  });
});
