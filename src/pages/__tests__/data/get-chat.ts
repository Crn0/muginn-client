import type { TGroupChat } from "@/features/chats/api";
import { db } from "../../../../test/mocks";

export const getChat = (username: string): TGroupChat => {
  const chat = db.chat.findFirst({
    where: {
      owner: {
        username: {
          equals: username,
        },
      },
    },
  });

  if (!chat) throw Error("No chat found");

  return {
    id: chat.id,
    name: chat.name ?? `${username}-group-chat`,
    isPrivate: chat.isPrivate,
    ownerId: chat.owner?.id as string,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
    avatar: null,
    type: "GroupChat",
  };
};
