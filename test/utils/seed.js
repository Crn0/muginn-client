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
