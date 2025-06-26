import { expect, afterEach, beforeAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { seedUser, seedPermissions } from "../utils";

const { server } = await import("../mocks");

expect.extend(matchers);

vi.mock("zustand");

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });

  seedUser();
  seedPermissions();
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => server.close());
