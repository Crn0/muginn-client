import type { TChat } from "@/features/chats/api";
import type { IPolicyEnvironment, IUserWithRole } from "./policy.types";

import { canActOnTargetRole, isOwner } from "./role-utils";
import { permissionCheck } from "./permission-check";

export const rolePolicy = {
  view: (user: IUserWithRole, chat: TChat, { permissions }: IPolicyEnvironment) => {
    if (!permissions) return false;

    if (isOwner(user, chat)) return true;

    return permissionCheck(user, permissions);
  },

  update: {
    profile: (
      user: IUserWithRole,
      chat: TChat,
      { targetRole, permissions }: IPolicyEnvironment
    ) => {
      if (!permissions || !targetRole) return false;

      if (isOwner(user, chat)) return true;

      return canActOnTargetRole(user, targetRole, permissions);
    },
    members: (
      user: IUserWithRole,
      chat: TChat,
      { targetRole, permissions }: IPolicyEnvironment
    ) => {
      if (!permissions || !targetRole) return false;

      if (isOwner(user, chat)) return true;

      return canActOnTargetRole(user, targetRole, permissions);
    },
    roleLevel: (
      user: IUserWithRole,
      chat: TChat,
      { targetRoles, permissions }: IPolicyEnvironment
    ) => {
      if (!permissions || !targetRoles) return false;
      if (!targetRoles.some((role) => role.roleLevel)) return false;
      if (isOwner(user, chat)) return true;

      return targetRoles.every((role) => canActOnTargetRole(user, role, permissions));
    },
  },
  delete: (user: IUserWithRole, chat: TChat, { targetRole, permissions }: IPolicyEnvironment) => {
    if (!permissions || !targetRole) return false;

    if (isOwner(user, chat)) return true;

    return canActOnTargetRole(user, targetRole, permissions);
  },
};
