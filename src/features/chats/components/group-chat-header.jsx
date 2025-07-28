import PropTypes from "prop-types";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";

import { cn } from "../../../utils";
import { useChat } from "../api";
import { Spinner } from "../../../components/ui/spinner";
import { DropDownMenu } from "../../../components/ui/dropdown";
import { Button } from "../../../components/ui/button";

import LeaveGroupChat from "./leave-group-chat";

export default function GroupChatHeader({ chatId }) {
  const chatQuery = useChat(chatId, {
    enabled: !!chatId && chatId !== "me",
  });

  const chat = chatQuery?.data;

  if (chatQuery.isLoading && !chat) {
    return (
      <div className='absolute top-[50%] left-[50%] sm:hidden'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='flex flex-1 p-2'>
      <div className='flex flex-1 flex-col border border-b-0 border-slate-900 p-2 sm:p-5'>
        <DropDownMenu
          id='group-chat-view-dropdown'
          className='fixed top-15 bg-black p-1 sm:top-30'
          renderButtonTrigger={(options) => (
            <div
              className='flex-1 rounded-md bg-contain bg-no-repeat'
              style={{
                ...(chat.avatar ? { backgroundImage: `url(${chat.avatar.url})` } : {}),
              }}
            >
              <Button
                type='button'
                testId='chat-drop-down-trigger'
                onClick={options.onClick}
                ref={options.triggerRef}
                variant='outline'
                size='lg'
                className={cn(
                  "flex w-full justify-between gap-2 border-2 border-gray-900 p-5 text-lg text-white hover:bg-gray-200/20 sm:w-lg",
                  `${!chat.avatar ? "" : "border-2 border-none bg-black/20 hover:bg-black/50 hover:backdrop-blur-md sm:border-0"}`
                )}
              >
                <>
                  <p className='overflow-hidden'>{chat.name}</p>
                  <p className='text-lg'>
                    {!options.isOpen ? <MdOutlineKeyboardArrowDown /> : <IoCloseSharp />}
                  </p>
                </>
              </Button>
            </div>
          )}
        >
          <LeaveGroupChat chat={chat} />
        </DropDownMenu>
      </div>
    </div>
  );
}

GroupChatHeader.propTypes = {
  chatId: PropTypes.string.isRequired,
};
