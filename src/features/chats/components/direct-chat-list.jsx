import { useQuery } from "@tanstack/react-query";

import { getChatsQueryOptions } from "../api/get-chats";
import { Spinner } from "../../../components/ui/spinner";
import { Link } from "../../../components/ui/link";
import { Avatar } from "../../../components/ui/image";
import avatar from "../../../assets/avatar.png";
import avatarLazy from "../../../assets/avatar-lazy.png";

const fallback = { image: avatar, lazyImage: avatarLazy };

export default function DirectChatList() {
  const chatsQuery = useQuery({
    ...getChatsQueryOptions(),
    // throwOnError: (e) => e.response?.status >= 500 || e.message.toLowerCase() === "failed to fetch",
  });

  if (chatsQuery.isLoading && !chatsQuery.data) {
    return (
      <div>
        <Spinner />
      </div>
    );
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
          <Avatar
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
