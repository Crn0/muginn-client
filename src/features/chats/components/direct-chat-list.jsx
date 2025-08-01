import { useQuery } from "@tanstack/react-query";

import { getChatsQueryOptions } from "../api/get-chats";
import { Link } from "../../../components/ui/link";
import { UserAvatar } from "../../../components/ui/image";
import avatar from "../../../assets/avatar.png";
import avatarLazy from "../../../assets/avatar-lazy.png";

const fallback = { image: avatar, lazyImage: avatarLazy };

export default function DirectChatList() {
  const chatsQuery = useQuery({
    ...getChatsQueryOptions(),
  });

  if (chatsQuery.isLoading && !chatsQuery.data) {
    return null;
  }

  const chats = Array.isArray(chatsQuery.data)
    ? chatsQuery.data.filter((chat) => chat.type === "DirectChat")
    : [];

  if (chats.length === 0) {
    return null;
  }

  return (
    <div data-testid='direct-chat-list'>
      {chats.map((chat) => (
        <Link key={chat.id} to={`/chats/${chat.id}`}>
          <UserAvatar
            type='direct'
            asset={chat.avatar}
            alt={`Direct chat ${chat.id}`}
            fallback={fallback}
          />
        </Link>
      ))}
    </div>
  );
}
