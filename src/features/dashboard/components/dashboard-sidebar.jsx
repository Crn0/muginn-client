import { ErrorBoundary } from "react-error-boundary";
import { IoIosAddCircleOutline } from "react-icons/io";

import { paths } from "../../../configs";
import { useGetUser } from "../../../lib";
import { ErrorElement } from "../../../components/errors";

import { Link } from "../../../components/ui/link";
import { NameplatePreview } from "../../../components/ui/preview";
import GroupChatList from "../../chats/components/group-chat-list";
import CreateGroupChat from "../../chats/components/create-group-chat";
import { Button } from "../../../components/ui/button";
import { ModalDialog } from "../../../components/ui/dialog";

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
          <div>
            <CreateGroupChat />
          </div>
        </ModalDialog>
      </ErrorBoundary>

      <div>
        <ErrorBoundary FallbackComponent={ErrorElement}>
          <NameplatePreview
            username={user.username}
            displayName={user.profile.displayName}
            asset={user.profile.asset}
          />
        </ErrorBoundary>
      </div>
    </aside>
  );
}
