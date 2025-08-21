import { MessageList } from "./message-list";
import { CreateMessage } from "./create-message";

export function Messages({ chatId }: { chatId: string }) {
  return (
    <>
      <MessageList chatId={chatId} />

      <CreateMessage chatId={chatId} />
    </>
  );
}
