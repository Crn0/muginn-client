import { ErrorBoundary } from "react-error-boundary";
import { IoIosAddCircleOutline, IoIosSettings } from "react-icons/io";

import { paths } from "../../../configs";
import { useGetUser } from "../../../lib";
import { ErrorElement } from "../../../components/errors";

import { ModalDialog } from "../../../components/ui/dialog";
import { Link } from "../../../components/ui/link";
import { NameplatePreview } from "../../../components/ui/preview";
import { Button } from "../../../components/ui/button";
import GroupChatList from "../../chats/components/group-chat-list";
import CreateGroupChat from "../../chats/components/create-group-chat";
import JoinGroupChat from "../../chats/components/join-group-chat";

export default function DashBoardSideBar() {
  const { data: user } = useGetUser();

  return (
    <aside>
      <nav>
        <div>
          <Link to={paths.protected.dashboard.me.getHref()}>DM</Link>
        </div>

        <ErrorBoundary FallbackComponent={ErrorElement}>
          <GroupChatList />
        </ErrorBoundary>
      </nav>

      <ErrorBoundary FallbackComponent={ErrorElement}>
        <ModalDialog
          title='Create Your Group Chat'
          descriptions={[
            "Your group chat is where you and your friends hang out. Make yours and start talking.",
          ]}
          renderButtonTrigger={(options) => (
            <div>
              <Button
                type='button'
                testId='dialog-trigger'
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

            <div>
              <h2>Have an invite already?</h2>
              <JoinGroupChat />
            </div>
          </>
        </ModalDialog>
      </ErrorBoundary>

      <div className='flex max-w-2xs border-2 border-gray-900 bg-gray-950'>
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
    </aside>
  );
}
