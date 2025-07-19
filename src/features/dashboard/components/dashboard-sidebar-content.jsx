import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useParams } from "react-router-dom";
import { IoIosAddCircleOutline, IoIosSettings } from "react-icons/io";
import { GiRaven } from "react-icons/gi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";

import { paths } from "../../../configs";
import { useGetUser } from "../../../lib";
import { useChat } from "../../chats/api";
import { ErrorElement } from "../../../components/errors";
import { DropDownMenu } from "../../../components/ui/dropdown";
import { GroupChatAvatar } from "../../../components/ui/image";
import { ModalDialog } from "../../../components/ui/dialog";
import { NameplatePreview } from "../../../components/ui/preview";
import { Link } from "../../../components/ui/link";
import { Button } from "../../../components/ui/button";
import GroupChatList from "../../chats/components/group-chat-list";
import CreateGroupChat from "../../chats/components/create-group-chat";
import DirectChatList from "../../chats/components/direct-chat-list";
import LeaveGroupChat from "../../chats/components/leave-group-chat";
import JoinGroupChat from "../../chats/components/join-group-chat";

const initCondition = (chatId, location) => (type) => {
  if (type === "direct:list") {
    return location.pathname === "/chats/me";
  }

  if (type === "direct:view") {
    return location.pathname.startsWith("/chats/me/") && !!chatId;
  }

  if (type === "group:view") {
    return (
      location.pathname.startsWith("/chats/") &&
      !location.pathname.startsWith("/chats/me") &&
      !!chatId
    );
  }

  return false;
};

export default function DashboardSidebarContent() {
  const location = useLocation();
  const params = useParams();

  const { data: user } = useGetUser();

  const chatQuery = useChat(params.chatId, {
    enabled: !!params.chatId && params.chatId !== "me",
  });

  const chat = chatQuery?.data;
  const condition = initCondition(params.chatId, location);

  return (
    <>
      <nav className='flex flex-col place-items-center gap-5 sm:p-5'>
        <div>
          <Link testId='dm' to={paths.protected.dashboard.me.getHref()} variant='button'>
            <GiRaven color='white' />
          </Link>

          <div className='border-5 border-gray-900' />
        </div>

        <ErrorBoundary FallbackComponent={ErrorElement}>
          <GroupChatList />
        </ErrorBoundary>

        <ErrorBoundary FallbackComponent={ErrorElement}>
          <ModalDialog
            parentId='dashboard-main'
            title='Create Your Group Chat'
            descriptions={[
              "Your group chat is where you and your friends hang out. Make yours and start talking.",
            ]}
            renderButtonTrigger={(options) => (
              <div>
                <Button
                  type='button'
                  testId='dialog-trigger'
                  variant='outline'
                  onClick={options.onClick}
                  ref={options.triggerRef}
                >
                  <IoIosAddCircleOutline />
                </Button>
              </div>
            )}
          >
            <>
              <div>
                <CreateGroupChat />
              </div>

              <div className='grid place-content-center place-items-center gap-2'>
                <h2>Have an invite already?</h2>
                <JoinGroupChat />
              </div>
            </>
          </ModalDialog>
        </ErrorBoundary>
      </nav>

      <div className='fixed bottom-2 left-2 flex w-md max-w-2xs border-2 border-gray-900 bg-gray-950'>
        <ErrorBoundary FallbackComponent={ErrorElement}>
          <NameplatePreview
            username={user.username}
            displayName={user.profile.displayName}
            asset={user.profile.asset}
            className='flex-[0.9]'
          />
        </ErrorBoundary>

        <div className='grid place-content-center'>
          <Link to={paths.protected.userSettings.getHref()} className='text-gray-300'>
            <IoIosSettings />
          </Link>
        </div>
      </div>

      {condition("direct:list") && (
        <ErrorBoundary fallbackRender={ErrorElement}>
          <div className='flex flex-1 flex-col gap-1 border border-b-0 border-slate-900'>
            <div className='p-2'>
              <h2>Find or start a conversation</h2>
            </div>

            <div className='flex-1 border-t-2 border-gray-900 p-2'>
              <h3>Direct Messages</h3>
              <ErrorBoundary fallbackRender={ErrorElement}>
                <DirectChatList />
              </ErrorBoundary>
            </div>
          </div>
        </ErrorBoundary>
      )}

      {condition("group:view") && (
        <div className='flex flex-1 p-2'>
          <GroupChatAvatar
            asset={chat.avatar}
            alt={chat.name}
            type='group'
            variant='banner'
            size='lg'
            className='w-[90%]'
          />
          <div className='flex flex-1 flex-col border border-b-0 border-slate-900 p-2 sm:p-5'>
            <DropDownMenu
              id='group-chat-view-dropdown'
              className='p-1'
              renderButtonTrigger={(options) => (
                <Button
                  type='button'
                  testId='chat-drop-down-trigger'
                  onClick={options.onClick}
                  ref={options.triggerRef}
                  variant='outline'
                  size='lg'
                  className='flex w-full justify-between gap-2 border-2 border-gray-900 p-5 text-lg text-white hover:bg-gray-200/20 sm:w-lg'
                >
                  <>
                    <p className='overflow-hidden'>{chat.name}</p>
                    <p className='text-lg'>
                      {!options.isOpen ? <MdOutlineKeyboardArrowDown /> : <IoCloseSharp />}
                    </p>
                  </>
                </Button>
              )}
            >
              <LeaveGroupChat chat={chat} />
            </DropDownMenu>
          </div>
        </div>
      )}
    </>
  );
}
