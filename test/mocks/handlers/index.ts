import { authHandlers } from "./auth";
import { userHandlers } from "./user";
import { chatHandlers } from "./chat";

export const handlers = [...authHandlers, ...userHandlers, ...chatHandlers];
