import type { IPolicyEnvironment, IUserWithRole } from "./policy.types";

import {
  canActOnTargetUser,
  getHighestRoleLevel,
  isAdmin,
  isOwner,
  isSameUser,
} from "./role-utils";
import { permissionCheck } from "./permission-check";

export const memberPolicy = {
  mute: (
    user: IUserWithRole,
    targetUser: IUserWithRole,
    { chat, permissions }: IPolicyEnvironment
  ) => {
    if (!permissions || !chat) return false;

    if (isSameUser(user, targetUser)) return false;

    if (isAdmin(targetUser)) return false;

    if (isOwner(user, chat)) return true;

    return canActOnTargetUser(user, targetUser, permissions);
  },
  unmute: (
    user: IUserWithRole,
    targetUser: IUserWithRole,
    { chat, permissions }: IPolicyEnvironment
  ) => {
    if (!permissions || !chat) return false;

    if (isSameUser(user, targetUser)) return false;
    if (isOwner(user, chat)) return true;

    const targetLevel = getHighestRoleLevel(targetUser.roles);
    const userLevel = getHighestRoleLevel(user.roles);

    if (userLevel < targetLevel) return true;

    if (userLevel > targetLevel) return false;

    return permissionCheck(user, permissions);
  },
  kick: (
    user: IUserWithRole,
    targetUser: IUserWithRole,
    { chat, permissions }: IPolicyEnvironment
  ) => {
    if (!permissions || !chat) return false;
    if (isOwner(user, chat)) return false;
    if (isSameUser(user, targetUser)) return false;
    if (isOwner(user, chat)) return true;

    return canActOnTargetUser(user, targetUser, permissions);
  },
};
