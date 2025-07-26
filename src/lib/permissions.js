export const flatPermissions = [
  "admin",
  "manage_chat",
  "manage_role",
  "manage_message",
  "kick_member",
  "mute_member",
  "send_message",
];

export const permissions = {
  chat: {
    update: {
      profile: ["manage_chat", "admin"],
      settings: ["admin"],
    },
  },
  member: {
    update: {
      mute: ["admin", "mute_member"],
      unMute: ["admin", "mute_member"],
    },
    delete: ["admin", "kick_member"],
  },
  role: {
    create: ["admin", "manage_role"],
    view: ["admin", "manage_role"],
    update: ["admin", "manage_role"],
  },
  message: {
    create: ["admin", "send_message", "manage_message"],
    delete: ["admin", "manage_message"],
  },
};
