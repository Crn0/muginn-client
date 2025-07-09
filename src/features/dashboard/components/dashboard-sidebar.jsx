import { ErrorBoundary } from "react-error-boundary";

import { paths } from "../../../configs";
import { useGetUser } from "../../../lib";
import { ErrorElement } from "../../../components/errors";
import { Link } from "../../../components/ui/link";
import GroupChatList from "../../chats/components/group-chat-list";
import CreateGroupChat from "../../chats/components/create-group-chat";
import { NameplatePreview } from "../../../components/ui/preview";

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
        <CreateGroupChat />
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
