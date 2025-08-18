import { faker } from "@faker-js/faker";

interface CreateChatsOptions {
  ownerId: string;
  nameTemplate?: string;
  avatar?: string;
  type: "GroupChat" | "DirectChat";
  isPrivate?: boolean;
  length?: number;
}

export const createChats = ({
  ownerId,
  nameTemplate,
  avatar,
  type,
  isPrivate = false,
  length = 5,
}: CreateChatsOptions) => {
  if (type === "DirectChat") {
    return Array.from({ length }).map(() => ({
      id: faker.string.uuid(),
      name: null,
      isPrivate: true,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      type: "DirectChat",
      avatar: null,
    }));
  }

  return Array.from({ length }).map((_, i) => ({
    ownerId,
    isPrivate,
    id: faker.string.uuid(),
    name: nameTemplate ? `${nameTemplate}${i}` : `${i}_test_chat`,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    type: "GroupChat",
    avatar: avatar ?? null,
  }));
};
