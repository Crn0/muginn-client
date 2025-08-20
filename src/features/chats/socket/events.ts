export const CHAT_NAMESPACE = "/chats" as const;

export const CHAT_JOIN = "join:chat" as const;
export const CHAT_LEAVE = "leave:chat" as const;

export const CHAT_ROOM = (chatId: string) => `chat:${chatId}`;
export const CHAT_MESSAGES = (chatId: string) => `view:chat:${chatId}:messages`;
