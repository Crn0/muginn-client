import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";

import { paths } from "../../../configs";
import { cn } from "../../../utils";
import { useChat, useMyMembership } from "../api";
import { Authorization, permissions, policies } from "../../../lib";
import { DropDownMenu } from "../../../components/ui/dropdown";
import { Button } from "../../../components/ui/button";
import { Spinner } from "../../../components/ui/spinner";

import LeaveGroupChat from "./leave-group-chat";
import { Link } from "../../../components/ui/link";

function HeaderChildren({ chat }) {
  const location = useLocation();
  const membershipQuery = useMyMembership(chat.id);

  const environment = useMemo(
    () => ({
      permissions: [
        ...new Set([
          ...permissions.chat.update.settings,
          ...permissions.chat.update.profile,
          ...permissions.role.create,
          ...permissions.role.update,
        ]),
      ],
    }),
    []
  );

  if (membershipQuery.isLoading && !membershipQuery.data) {
    return (
      <div className='absolute top-40 left-30'>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Authorization
        user={membershipQuery.data}
        resource='chat'
        action='update'
        data={chat}
        policies={policies}
        environment={environment}
      >
        <Link
          to={paths.protected.chatSettings.getHref({ chatId: chat.id })}
          variant='outline'
          className='justify-baseline hover:bg-gray-500/50 hover:opacity-100 hover:backdrop-blur-md'
          state={{ prevPathName: location.pathname }}
        >
          Chat Settings
        </Link>
      </Authorization>

      <LeaveGroupChat chat={chat} />
    </>
  );
}

export default function GroupChatHeader({ chatId }) {
  const chatQuery = useChat(chatId, {
    enabled: !!chatId && chatId !== "me",
  });

  const chat = chatQuery?.data;

  if (chatQuery.isLoading && !chat) {
    return (
      <div className='absolute top-50 left-[50%]'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='flex flex-1 p-2'>
      <div className='flex flex-1 flex-col border border-b-0 border-slate-900 p-2 sm:p-5'>
        <DropDownMenu
          id='group-chat-view-dropdown'
          className='fixed top-15 z-50 flex flex-col gap-5 bg-black p-1 sm:top-30'
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
          <HeaderChildren chat={chat} />
        </DropDownMenu>
      </div>
    </div>
  );
}

GroupChatHeader.propTypes = {
  chatId: PropTypes.string.isRequired,
};

HeaderChildren.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.shape({
      url: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string.isRequired,
          format: PropTypes.string.isRequired,
          size: PropTypes.number.isRequired,
        })
      ),
    }),
    type: PropTypes.oneOf(["GroupChat"]),
  }).isRequired,
};
