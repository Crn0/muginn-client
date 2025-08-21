import { useEffect, useState } from "react";

import { useInfiniteMessages } from "../api/get-messages";
import { InfiniteScroll } from "@/lib";
import { Spinner } from "@/components/ui/spinner";
import { Message } from "./message";

export function MessageList({ chatId }: { chatId: string }) {
  const messagesQuery = useInfiniteMessages(chatId);

  const [messageNode, setMessageNode] = useState<HTMLElement | null>(null);

  const messages = messagesQuery.data?.pages?.flatMap((page) => page.messages) ?? [];

  useEffect(() => {
    if (messageNode) {
      messageNode?.scrollIntoView?.({ behavior: "auto" });
    }
  }, [messageNode]);

  if (messagesQuery.isLoading && !messages.length) {
    return (
      <div className='flex flex-1 items-center-safe justify-center-safe'>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {messagesQuery.hasNextPage && (
        <InfiniteScroll
          testId='load-next-page'
          loadMore={() => messagesQuery.fetchNextPage()}
          isLoading={messagesQuery.isFetchingNextPage}
          canLoadMore={messagesQuery.hasNextPage}
          options={{ delay: 1000 }}
        />
      )}
      <ul aria-label='messages' className='flex flex-1 flex-col gap-1'>
        {messages.map((message, index, arr) => (
          <li
            ref={index === arr.length - 1 ? setMessageNode : null}
            key={message.id}
            aria-label={`comment-${message.content}-${message.id}`}
          >
            <Message key={message.id} message={message} />
          </li>
        ))}
      </ul>
    </>
  );
}
