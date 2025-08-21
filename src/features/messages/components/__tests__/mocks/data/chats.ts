import type { TDirectChat, TGroupChat } from "@/features/chats/api";
import type { TAsset } from "@/types";
import { faker } from "@faker-js/faker";

export const createChats = ({
  ownerId,
  nameTemplate,
  avatar,
  type,
  isPrivate = false,
  length = 5,
}: {
  ownerId?: string;
  nameTemplate?: string;
  avatar?: TAsset;
  type: "DirectChat" | "GroupChat";
  isPrivate?: boolean;
  length?: number;
}) => {
  if (type === "DirectChat") {
    return Array.from({ length }).map(() => ({
      id: faker.string.uuid(),
      ownerId: null,
      name: null,
      isPrivate: true,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      type: "DirectChat",
      avatar: null,
    })) satisfies TDirectChat[];
  }

  return Array.from({ length }).map((_, i) => ({
    isPrivate,
    ownerId: ownerId ?? faker.string.uuid(),
    id: faker.string.uuid(),
    name: nameTemplate ? `${nameTemplate}${i}` : `${i}_test_chat`,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    type: "GroupChat",
    avatar: avatar ?? null,
  })) satisfies TGroupChat[];
};
