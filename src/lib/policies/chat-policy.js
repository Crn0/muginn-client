import permissionCheck from "./permission-check";

export default {
  update: (user, chat, { permissions }) => {
    if (user.id === chat.ownerId) return true;

    return permissionCheck(user, chat, permissions);
  },
  leave: (user, chat) => user.id !== chat.ownerId,
  delete: (user, chat) => user.id === chat?.ownerId,
};
