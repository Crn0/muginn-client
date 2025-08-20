import type { TChat } from "@/features/chats/api";
import type { IPolicyEnvironment, IUserWithRole } from "./policy.types";

import { permissionCheck } from "./permission-check";

export const chatPolicy = {
  update: (user: IUserWithRole, chat: TChat, { permissions }: IPolicyEnvironment) => {
    if (!permissions) return false;

    if (user.id === chat.ownerId) return true;

    return permissionCheck(user, permissions);
  },
  leave: (user: Pick<IUserWithRole, "id">, chat: TChat) => user.id !== chat.ownerId,
  delete: (user: Pick<IUserWithRole, "id">, chat: TChat) => user.id === chat.ownerId,
};
