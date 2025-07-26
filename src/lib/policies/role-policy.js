import { canActOn, isOwner } from "../role-utils";
import permissionCheck from "./permission-check";

export default {
  view: (user, chat, { permissions }) => {
    if (isOwner(user, chat)) return true;

    return permissionCheck(user, chat, permissions);
  },
  create: (user, chat, { permissions }) => {
    if (isOwner(user, chat)) return true;

    return permissionCheck(user, chat, permissions);
  },
  update: {
    profile: (user, chat, { targetRole, permissions }) => {
      if (isOwner(user, chat)) return true;

      return canActOn(user, targetRole, permissions);
    },
    members: (user, chat, { targetRole, permissions }) => {
      if (isOwner(user, chat)) return true;

      return canActOn(user, targetRole, permissions);
    },
    roleLevel: (user, chat, { targetRoles, permissions }) => {
      if (!targetRoles.some((role) => role.roleLevel)) return false;
      if (isOwner(user, chat)) return true;

      return targetRoles.every((role) => canActOn(user, role, permissions));
    },
  },
  delete: (user, chat, { targetRole, permissions }) => {
    if (isOwner(user, chat)) return true;

    return canActOn(user, targetRole, permissions);
  },
};
