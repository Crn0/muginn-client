import { faker } from "@faker-js/faker";

import defaultImage from "../../../../../../assets/default-image.png";
import defaultImageLazy from "../../../../../../assets/default-image-lazy.png";

export default function createMessages({ content, user, length = 5 }) {
  if (length <= 1) {
    return {
      id: faker.string.uuid(),
      chatId: faker.string.uuid(),
      content: content || "hello_world",
      createdAt: new Date().toISOString(),
      updatedAt: null,
      deletedAt: null,
      user: user ?? {
        id: faker.string.uuid(),
        username: faker.internet.username(),
        profile: {
          displayName: faker.internet.displayName(),
          avatar: {
            url: faker.image.avatarGitHub(),
            images: [],
          },
        },
      },
      replies: [],
      replyTo: null,
      attachments: [
        {
          id: faker.string.uuid(),
          url: defaultImage,
          images: [{ url: defaultImageLazy, size: 1, format: "png" }],
        },
      ],
    };
  }

  return Array.from({ length }).map((_, index) => ({
    id: faker.string.uuid(),
    chatId: faker.string.uuid(),
    content: content ? `${content}_${index}` : `hello_world_${index}`,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    deletedAt: null,
    user: user ?? {
      id: faker.string.uuid(),
      username: faker.internet.username(),
      profile: {
        displayName: faker.internet.displayName(),
        avatar: {
          url: faker.image.avatarGitHub(),
          images: [],
        },
      },
    },
    replies: [],
    replyTo: null,
    attachments: [
      {
        id: faker.string.uuid(),
        url: defaultImage,
        images: [{ url: defaultImageLazy, size: 1, format: "png" }],
      },
    ],
  }));
}
