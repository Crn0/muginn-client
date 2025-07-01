import { useQuery } from "@tanstack/react-query";

import { getChatsQueryOptions } from "../api/get-chats";
import { Spinner } from "../../../components/ui/spinner";
import { Link } from "../../../components/ui/link";
import { Avatar } from "../../../components/ui/image";

export default function GroupChatList() {
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

  const chats = chatsQuery?.data?.filter?.((chat) => chat.type === "GroupChat") ?? [];

  if (chats.length === 0) {
    return null;
  }

  return (
    <div data-testid='group-chat-list'>
      {chats.map((chat) => (
        <Link key={chat.id} to={`/chats/${chat.id}`}>
          <Avatar type='group' asset={chat.avatar} alt={chat.name} />
        </Link>
      ))}
    </div>
  );
}
