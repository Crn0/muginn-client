import type { TChatList } from "@/features/chats/api";
import type { TAuthUser } from "../auth";

export const userPolicy = {
  delete: (user: TAuthUser, chats: TChatList) => chats.every((chat) => chat.ownerId !== user.id),
};
