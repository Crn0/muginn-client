import { useParams } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";

import { getChatQueryOptions } from "../api/get-chat";
import { ContentLayout } from "../../../components/layouts";
import { DropDownMenu } from "../../../components/ui/dropdown";
import { Avatar } from "../../../components/ui/image";
import { Button } from "../../../components/ui/button";
import LeaveGroupChat from "./leave-group-chat";
import Messages from "../../messages/components/messages";
import avatar from "../../../assets/avatar.png";
import avatarLazy from "../../../assets/avatar-lazy.png";

const fallback = {
  image: avatar,
  lazyImage: avatarLazy,
};

export default function GroupChatView() {
  const { chatId } = useParams();
  const { data: chat } = useSuspenseQuery({
    ...getChatQueryOptions(chatId),
  });

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

  return (
    <ContentLayout
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
            <DropDownMenu
              renderButtonTrigger={(options) => (
                <div>
                  <Button
                    type='button'
                    testId='drop-down-trigger'
                    onClick={options.onClick}
                    ref={options.triggerRef}
                  >
                    {!options.isOpen ? <MdOutlineKeyboardArrowDown /> : <IoCloseSharp />}
                  </Button>
                </div>
              )}
            >
              <LeaveGroupChat chat={chat} />
            </DropDownMenu>
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

          <div>
            <Messages chatId={chat.id} />
          </div>
        </section>
      </>
    </ContentLayout>
  );
}
