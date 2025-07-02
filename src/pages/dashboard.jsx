import { useLocation, useParams } from "react-router-dom";

import { useChat } from "../features/chats/api";
import { DashBoardLayout } from "../components/layouts";
import DashBoardSideBar from "../features/dashboard/components/dashboard-sidebar";
import DashboardContent from "../features/dashboard/components/dashboard-content";

export default function DashBoard() {
  const location = useLocation();
  const params = useParams();

  const { data: chat } = useChat(params.chatId, {
    enabled: !!params.chatId && params.chatId !== "me",
  });

  return (
    <DashBoardLayout title={chat?.name || "dashboard"}>
      <>
        <DashBoardSideBar />
        <DashboardContent />
      </>
    </DashBoardLayout>
  );
}
