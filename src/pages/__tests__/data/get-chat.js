import { db } from "../../../../test/mocks";

export default (username) =>
  db.chat.findFirst({
    where: {
      owner: {
        username: {
          equals: username,
        },
      },
    },
  });
