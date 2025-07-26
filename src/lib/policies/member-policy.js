import { canActOn, getHighestRoleLevel, isAdmin, isOwner, isSameUser } from "../role-utils";
import permissionCheck from "./permission-check";

export default {
  mute: (user, targetUser, { chat, permissions }) => {
    if (isSameUser(user, targetUser)) return false;

    if (isAdmin(user, targetUser)) return false;

    if (isOwner(user, chat)) return true;

    return canActOn(user, targetUser, permissions);
  },
  unmute: (user, targetUser, { chat, permissions }) => {
    if (isSameUser(user, targetUser)) return false;
    if (isOwner(user, chat)) return true;

    const targetLevel = getHighestRoleLevel(targetUser);
    const userLevel = getHighestRoleLevel(user);

    if (userLevel < targetLevel) return true;

    if (userLevel > targetLevel) return false;

    return permissionCheck(user, permissions);
  },
  kick: (user, targetUser, { chat, permissions }) => {
    if (isOwner(user, chat)) return false;
    if (isSameUser(user, targetUser)) return false;
    if (isOwner(user, chat)) return true;

    return canActOn(user, targetUser, permissions);
  },
};
