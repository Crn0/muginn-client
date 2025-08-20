import { QueryClient } from "@tanstack/react-query";
import { createMemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";

import { paths } from "@/configs";
import { setupRouter } from "./mocks/utils/setup";
import { CreateDirectChat } from "..";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { enabled: false },
  },
});

const memberIds = [faker.string.uuid(), faker.string.uuid()];

const routes = [
  {
    path: paths.protected.dashboard.me.getHref(),
    element: <CreateDirectChat memberIds={memberIds} />,
  },
];

describe("DirectChat Creation", () => {
  it("renders the form", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: [paths.protected.dashboard.me.getHref()],
    });

    setupRouter(router, queryClient);

    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByTestId("create-chat-form-submit")).toBeInTheDocument();
  });
});
