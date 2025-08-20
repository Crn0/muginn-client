import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { env } from "@/configs";
import { debug } from "@/lib";
import { chatSocket, CHAT_JOIN, CHAT_LEAVE, CHAT_MESSAGES } from "../socket";

export const useChatSocket = (chatId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (env.NODE_ENV === "test" || !chatId) return () => {};

    if (!chatSocket.connected) {
      chatSocket.connect();
    }

    const roomEvent = CHAT_MESSAGES(chatId);

    const handleMessage = (data: { entity: string[]; id?: string }) => {
      queryClient.invalidateQueries({ queryKey: data.entity });
    };

    debug(`user connecting to chat ${chatId}`);

    chatSocket.on(roomEvent, handleMessage);

    chatSocket.emit(CHAT_JOIN, chatId);

    chatSocket.on("connect_error", (e) => debug(e));

    return () => {
      debug(`user disconnecting to chat ${chatId}`);
      chatSocket.off(roomEvent, handleMessage);
      chatSocket.emit(CHAT_LEAVE, chatId);
    };
  }, [chatId, queryClient]);

  return chatSocket;
};
