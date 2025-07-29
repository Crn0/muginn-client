import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { db } from "../mocks";

import { env } from "../../src/configs";

export const generateRandomPassword = () => {
  // https://regexr.com/8dm04
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  let password = faker.internet.password({
    length: 8,
  });

  while (!regex.test(password)) {
    password = faker.internet.password({
      length: 8,
    });
  }

  return password;
};

export const createUser = () => {
  const displayName = faker.internet.displayName();
  const username = faker.internet.username();
  const password = generateRandomPassword();

  return Object.freeze({ displayName, username, password });
};

export const createChat = (data) => {
  let chat;

  const user = db.user.findFirst({
    where: {
      id: {
        equals: data.ownerId,
      },
    },
  });

  const permissions = db.permission.findMany({
    name: {
      in: ["send_message", "view_chat"],
    },
  });

  if (data.type === "GroupChat") {
    chat = db.chat.create({
      owner: user,
      name: data.name,
      type: data.type,
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
  } else {
    chat = db.chat.create({
      type: data.type,
      isPrivate: true,
    });

    const users = db.user.findMany({ where: { id: { in: [data.memberIds] } } });

    const roles = [
      db.role.create({
        permissions,
        chat,
      }),
    ];

    users.forEach((u) =>
      db.userOnChat.create({
        roles,
        chat,
        user: u,
      })
    );
  }

  return chat;
};

export const generateAccessToken = (username) => {
  const secret = env.getValue("tokenSecret");

  const user = db.user.findFirst({
    where: {
      username: {
        equals: username,
      },
    },
  });

  if (!user) throw new Error("User does not exist");

  const token = jwt.sign({}, secret, {
    expiresIn: "15m",
    subject: user.id,
  });

  return token;
};
