export default {
  delete: (user, chats) => chats.every((chat) => chat.ownerId !== user.id),
};
