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

// [
//   {
//     id: faker.string.uuid(),
//     name: "test_group_chat",
//     isPrivate: false,
//     createdAt: new Date().toISOString(),
//     updatedAt: null,
//     type: "GroupChat",
//     avatar: null,
//     ownerId: "0197a596-301b-7052-a071-3049fe6124aa",
//   },
// ];

// export const directChats = [
//   {
//     id: "0197a596-31eb-7330-857c-9d919e0630fe",
//     name: null,
//     isPrivate: true,
//     createdAt: "2025-06-25T05:36:13.291Z",
//     updatedAt: null,
//     type: "DirectChat",
//     avatar: null,
//   },
// ];
