import { db } from "../../../../test/mocks";

export const getChats = (username: string) =>
  db.chat.findFirst({
    where: {
      owner: {
        username: {
          equals: username,
        },
      },
    },
  });
