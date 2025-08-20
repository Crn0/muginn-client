import type { TMessage } from "@/features/messages/api";
import type { IPolicyEnvironment, IUserWithRole } from "./policy.types";

import { isAuthor, isOwner } from "./role-utils";
import { permissionCheck } from "./permission-check";

export const messagePolicy = {
  delete: (user: IUserWithRole, message: TMessage, { chat, permissions }: IPolicyEnvironment) => {
    if (isOwner(user, chat)) return true;
    if (isAuthor(user, message)) return true;

    return permissionCheck(user, permissions);
  },
};
