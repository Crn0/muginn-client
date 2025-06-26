import { db } from "../mocks";

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
