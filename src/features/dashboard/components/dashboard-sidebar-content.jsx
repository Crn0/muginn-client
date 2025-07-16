import { ErrorBoundary } from "react-error-boundary";
import { useLocation } from "react-router-dom";
import { IoIosAddCircleOutline, IoIosSettings } from "react-icons/io";
import { GiRaven } from "react-icons/gi";

import { paths } from "../../../configs";

import { useGetUser } from "../../../lib";
import { ErrorElement } from "../../../components/errors";
import ContentLayout from "../../../components/layouts/content-layout";
import { ModalDialog } from "../../../components/ui/dialog";
import { NameplatePreview } from "../../../components/ui/preview";
import { Link } from "../../../components/ui/link";
import { Button } from "../../../components/ui/button";
import GroupChatList from "../../chats/components/group-chat-list";
import CreateGroupChat from "../../chats/components/create-group-chat";
import JoinGroupChat from "../../chats/components/join-group-chat";
import DirectChatList from "../../chats/components/direct-chat-list";

export default function DashboardSidebarContent() {
  const location = useLocation();
  const { data: user } = useGetUser();

  return (
    <>
      <nav className='flex flex-col place-items-center gap-5 p-5'>
        <div>
          <Link testId='dm' to={paths.protected.dashboard.me.getHref()} variant='button'>
            <GiRaven color='white' />
          </Link>
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

      {location.pathname === "/chats/me" && (
        <ErrorBoundary fallbackRender={ErrorElement}>
          <div className='flex-1 border border-b-0 border-slate-900 p-5'>
            <ContentLayout
              header={
                <div>
                  <div>
                    <h2>Find or start a conversation</h2>
                  </div>
                  <div>
                    <h3>Direct Messages</h3>
                    <ErrorBoundary fallbackRender={ErrorElement}>
                      <DirectChatList />
                    </ErrorBoundary>
                  </div>
                </div>
              }
            />
          </div>
        </ErrorBoundary>
      )}
    </>
  );
}
