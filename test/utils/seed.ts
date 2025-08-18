import { db, GetEntity } from "../mocks";

export const seedUser = () => {
  const users = [
    { username: ".crno.", displayName: "crno", password: "Crnocrno123", accountLevel: 1 },
    { username: ".noir.", displayName: "crnoirno", password: "Noirnoir123", accountLevel: 1 },
  ];

  users.forEach((data) => {
    const { username, displayName, password, accountLevel } = data;
    const user = db.user.create({
      username,
      password,
      accountLevel,
    });

    db.profile.create({
      user,
      displayName,
    });
  });
};

export const seedChat = () => {
  const permissions = db.permission.findMany({
    where: {
      name: {
        in: ["send_message", "view_chat"],
      },
    },
  });

  const user = db.user.findFirst({
    where: {
      username: {
        equals: ".crno.",
      },
    },
  }) as GetEntity<"user">;

  const chat = db.chat.create({
    owner: user,
    name: "Test-Group-Chat",
    type: "GroupChat",
    isPrivate: false,
  });

  const roles = [
    db.role.create({
      permissions,
      chat,
    }),
  ];

  db.userOnChat.create({
    user,
    roles,
    chat,
  });
};

export const seedPermissions = () => {
  const perms = [
    "admin",
    "manage_chat",
    "manage_role",
    "manage_message",
    "kick_member",
    "mute_member",
    "send_message",
  ];

  perms.forEach((name) => {
    db.permission.create({
      name,
    });
  });
};
