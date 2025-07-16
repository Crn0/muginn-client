import { useQuery } from "@tanstack/react-query";

import { getChatsQueryOptions } from "../api/get-chats";
import { useDashboardDrawer } from "../../../components/layouts/context";
import { Spinner } from "../../../components/ui/spinner";
import { Link } from "../../../components/ui/link";
import { GroupChatAvatar } from "../../../components/ui/image";

export default function GroupChatList() {
  const chatsQuery = useQuery({
    ...getChatsQueryOptions(),
    throwOnError: (e) =>
      e.response?.status >= 500 || e?.code === 422 || e.message.toLowerCase() === "failed to fetch",
  });

  const { close, manual } = useDashboardDrawer();

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
          className='overflow-hidden bg-slate-950 text-xs'
          onClick={() => {
            manual();
            close();
          }}
        >
          <GroupChatAvatar type='group' asset={chat.avatar} size='icon' alt={chat.name} />
        </Link>
      ))}
    </div>
  );
}
