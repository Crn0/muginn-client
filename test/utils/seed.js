import { db } from "../mocks";

export const seedUser = () => {
  const user = db.user.create({
    username: ".crno.",
    password: "Crnocrno123",
  });

  db.profile.create({
    user,
    displayName: "crno",
  });
};
