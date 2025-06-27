import { useNavigation, useParams, useSubmit } from "react-router-dom";

import { leaveChatSchema } from "../schema";
import { useChat } from "../api/get-chat";
import { Spinner } from "../../../components/ui/spinner";
import { ChatLayout } from "../../../components/layouts";
import { Avatar } from "../../../components/ui/image";
import { FormDialog } from "../../../components/ui/form";
import { Button } from "../../../components/ui/button";
import avatar from "../../../assets/avatar.png";
import avatarLazy from "../../../assets/avatar-lazy.png";

const fallback = {
  image: avatar,
  lazyImage: avatarLazy,
};

export default function GroupChatView() {
  const { chatId } = useParams();
  const { isLoading, data: chat } = useChat(chatId);

  const navigate = useNavigation();
  const submit = useSubmit();

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

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

  const isFormSubmitting = navigate.state === "submitting";

  const descriptions = [
    `Are you sure you want to leave ${chat.name} ? You won't be able to rejoin this server unless you are re-invited.`,
  ];

  const onSubmit = (data) => submit(data, { method: "DELETE" });

  return (
    <ChatLayout
      header={
        <>
          <div>
            <Avatar
              asset={chat.avatar}
              fallback={fallback}
              alt={`${chat.name}'s avatar`}
              type='group'
            />
          </div>
          <div>
            <FormDialog
              id='Leave-Chat-Form'
              title={`Leave '${chat.name}'`}
              descriptions={descriptions}
              schema={leaveChatSchema}
              onSubmit={onSubmit}
              renderButtonTrigger={(options) => (
                <div>
                  <Button
                    type='button'
                    testId='chat-form-trigger'
                    onClick={options.onClick}
                    ref={options.triggerRef}
                  >
                    Leave Chat
                  </Button>
                </div>
              )}
              renderButtonCancel={(options) => (
                <div>
                  <Button type='button' testId='chat-form-cancel' onClick={options.onClick}>
                    Cancel
                  </Button>
                </div>
              )}
              renderButtonSubmit={() => (
                <div>
                  <Button
                    type='submit'
                    testId='chat-form-submit'
                    isLoading={isFormSubmitting}
                    disabled={isFormSubmitting}
                  >
                    Leave Chat
                  </Button>
                </div>
              )}
            />
          </div>
        </>
      }
    >
      <>
        <section>
          <h2>{chat.name}</h2>
        </section>

        <section>
          <div role='note'>
            <h3>
              <p>Welcome to</p>
              <p>{chat.name}</p>
            </h3>
            <div>This is the beginning of the chat</div>
          </div>
        </section>
      </>
    </ChatLayout>
  );
}
