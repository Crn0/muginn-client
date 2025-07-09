import PropTypes from "prop-types";

import { useInfiniteMessages } from "../api/get-messages";
import Message from "./message";
import { InfiniteScroll } from "../../../lib";
import { Spinner } from "../../../components/ui/spinner";

export default function MessageList({ chatId }) {
  const messagesQuery = useInfiniteMessages(chatId);

  if (messagesQuery.isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  const messages = messagesQuery.data?.pages?.flatMap((page) => page.messages) ?? [];

  if (!messages?.length) return null;

  return (
    <>
      {messagesQuery.hasPreviousPage && (
        <InfiniteScroll
          testId='load-previous-page'
          loadMore={() => messagesQuery.fetchPreviousPage()}
          isLoading={messagesQuery.isFetchingPreviousPage}
          canLoadMore={messagesQuery.hasPreviousPage}
        />
      )}
      <ul aria-label='messages'>
        {messages.map((message) => (
          <li key={message.id} aria-label={`comment-${message.content}-${message.id}`}>
            <Message key={message.id} message={message} />
          </li>
        ))}
      </ul>
      {messagesQuery.hasNextPage && (
        <InfiniteScroll
          testId='load-next-page'
          loadMore={() => messagesQuery.fetchNextPage()}
          isLoading={messagesQuery.isFetchingNextPage}
          canLoadMore={messagesQuery.isFetchingNextPage}
        />
      )}
    </>
  );
}

MessageList.propTypes = {
  chatId: PropTypes.string.isRequired,
};
