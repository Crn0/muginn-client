import "@testing-library/jest-dom/vitest";

import { expect, afterEach, beforeAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";

import * as matchers from "@testing-library/jest-dom/matchers";
import { seedUser, seedPermissions, seedChat } from "../utils";
import { setupIntersectionObserverMock } from "./intersection-observer";

const { server } = await import("../mocks");

expect.extend(matchers);

vi.mock("zustand");

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });

  setupIntersectionObserverMock();
  seedUser();
  seedChat();
  seedPermissions();

  return () => server.close();
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});
