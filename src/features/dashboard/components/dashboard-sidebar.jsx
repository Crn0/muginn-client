import { paths } from "../../../configs";
import { Link } from "../../../components/ui/link";
import { useGetUser } from "../../../lib";
import GroupChatList from "../../chats/components/group-chat-list";
import CreateGroupChat from "../../chats/components/create-group-chat";
import { NameplatePreview } from "../../../components/ui/preview";

export default function DashBoardSideBar() {
  const { data: user } = useGetUser();

  return (
    <aside>
      <nav>
        <div>
          <Link to={paths.dashboard.me.getHref()}>DM</Link>
        </div>

        <GroupChatList />
      </nav>

      <CreateGroupChat />

      <div>
        <NameplatePreview
          username={user.username}
          displayName={user.profile.displayName}
          asset={user.profile.asset}
        />
      </div>
    </aside>
  );
}
