import { isAuthor, isOwner } from "../role-utils";
import permissionCheck from "./permission-check";

export default {
  delete: (user, message, { chat, permissions }) => {
    if (isOwner(user, chat)) return true;
    if (isAuthor(user, message)) return true;

    return permissionCheck(user, permissions);
  },
};
