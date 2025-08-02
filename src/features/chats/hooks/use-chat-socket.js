import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { env } from "../../../configs";
import { chatSocket, CHAT_JOIN, CHAT_LEAVE, CHAT_MESSAGES } from "../socket";
import { debug } from "../../../lib";

export default function useChatSocket(chatId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (env.getValue("nodeEnv") === "test" || !chatId) return () => {};

    if (!chatSocket.connected) {
      chatSocket.connect();
    }

    const roomEvent = CHAT_MESSAGES(chatId);

    const handleMessage = (data) => {
      queryClient.invalidateQueries({ queryKey: data.entity });
    };

    debug(`user connecting to chat ${chatId}`);

    chatSocket.on(roomEvent, handleMessage);

    chatSocket.emit(CHAT_JOIN, chatId);

    return () => {
      debug(`user disconnecting to chat ${chatId}`);
      chatSocket.off(roomEvent, handleMessage);
      chatSocket.emit(CHAT_LEAVE, chatId);
    };
  }, [chatId, queryClient]);

  return chatSocket;
}
