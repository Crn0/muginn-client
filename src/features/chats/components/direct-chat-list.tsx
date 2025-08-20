import { useQuery } from "@tanstack/react-query";

import { getChatsQueryOptions, isDirectChat } from "../api";
import { Link } from "@/components/ui/link";
import { UserAvatar } from "@/components/ui/image";

export function DirectChatList() {
  const chatsQuery = useQuery({
    ...getChatsQueryOptions(),
  });

  if (!chatsQuery.isSuccess && !chatsQuery.data) {
    return null;
  }

  const chats = chatsQuery.data.filter(isDirectChat) ?? [];

  if (chats.length === 0) {
    return null;
  }

  return (
    <div data-testid='direct-chat-list'>
      {chats.map((chat) => (
        <Link key={chat.id} to={`/chats/${chat.id}`}>
          <UserAvatar type='direct' asset={chat.avatar} alt={`Direct chat ${chat.id}`} />
        </Link>
      ))}
    </div>
  );
}
