import { useParams } from "react-router-dom";

import { isGroupChat, useChat } from "../api";
import { useChatSocket } from "../hooks";
import { ChatLayout } from "@/components/layouts";
import { Messages } from "@/features/messages/components";

export function GroupChatView() {
  const params = useParams();
  const chatQuery = useChat(params.chatId ?? "");

  const chat = isGroupChat(chatQuery.data) ? chatQuery.data : null;

  useChatSocket(chat?.id);

  if (!chat) {
    return (
      <div role='alert'>
        <h2>No Chat</h2>
        <div>
          You find yourself in a strange place. You don&apos;t have access to this chat, or there
          are no chats available.
        </div>
      </div>
    );
  }

  return (
    <ChatLayout title='general'>
      <div className='flex flex-1 flex-col'>
        <div role='note' className='grid place-content-center-safe place-items-center-safe gap-1'>
          <h3 className='grid place-content-center-safe place-items-center-safe'>
            <p>Welcome to</p>
            <p>{chat.name}</p>
          </h3>
          <div>This is the beginning of the chat</div>
        </div>

        <div className='flex flex-1 flex-col'>
          <Messages chatId={chat.id} />
        </div>
      </div>
    </ChatLayout>
  );
}
