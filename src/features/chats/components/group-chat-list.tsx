import { useQuery } from "@tanstack/react-query";

import { getChatsQueryOptions, isGroupChat } from "../api";
import { useDashboardDrawer } from "@/components/layouts/context";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "@/components/ui/link";
import { GroupChatAvatar } from "@/components/ui/image";

export function GroupChatList() {
  const chatsQuery = useQuery({
    ...getChatsQueryOptions(),
    throwOnError: (e) =>
      (e.response && e.response.status >= 500) ||
      e?.code === 422 ||
      e.message.toLowerCase() === "failed to fetch",
  });

  const { close, manual } = useDashboardDrawer();

  if (!chatsQuery.isSuccess && !chatsQuery.data) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  const chats = chatsQuery.data.filter(isGroupChat) ?? [];

  if (chats.length === 0) {
    return null;
  }

  return (
    <div
      data-testid='group-chat-list'
      className='flex flex-col items-baseline justify-center-safe gap-5'
    >
      {chats.map((chat) => (
        <Link
          key={chat.id}
          to={`/chats/${chat.id}`}
          variant='button'
          size='icon'
          className='overflow-hidden rounded-full border-2 border-gray-900 bg-gray-950 p-5 text-center text-xs'
          onClick={() => {
            manual();
            close();
          }}
        >
          <GroupChatAvatar asset={chat.avatar} variant='icon' alt={chat.name} />
        </Link>
      ))}
    </div>
  );
}
