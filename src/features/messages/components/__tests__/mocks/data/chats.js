import { faker } from "@faker-js/faker";

export default function createChats({
  ownerId,
  nameTemplate,
  avatar,
  type,
  isPrivate = false,
  length = 5,
}) {
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
}
