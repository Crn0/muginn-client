import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useParams } from "react-router-dom";
import { IoIosAddCircleOutline, IoIosSettings } from "react-icons/io";
import { GiRaven } from "react-icons/gi";

import { paths } from "../../../configs";
import { useGetUser } from "../../../lib";
import { ErrorElement } from "../../../components/errors";

import { ModalDialog } from "../../../components/ui/dialog";
import { NameplatePreview } from "../../../components/ui/preview";
import { Link } from "../../../components/ui/link";
import { Button } from "../../../components/ui/button";
import GroupChatList from "../../chats/components/group-chat-list";
import CreateGroupChat from "../../chats/components/create-group-chat";
import DirectChatList from "../../chats/components/direct-chat-list";
import JoinGroupChat from "../../chats/components/join-group-chat";
import GroupChatHeader from "../../chats/components/group-chat-header";

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
        <ErrorBoundary fallbackRender={ErrorElement}>
          <GroupChatHeader chatId={params.chatId} />
        </ErrorBoundary>
      )}
    </>
  );
}
