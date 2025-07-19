import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useParams } from "react-router-dom";

import { useChat } from "../features/chats/api";
import { ErrorElement } from "../components/errors";
import { DashBoardLayout } from "../components/layouts";
import { Spinner } from "../components/ui/spinner";
import DashBoardSideBar from "../features/dashboard/components/dashboard-sidebar";
import DashboardContent from "../features/dashboard/components/dashboard-content";

export default function DashBoard() {
  const location = useLocation();
  const params = useParams();

  const { isLoading, data: chat } = useChat(params.chatId, {
    enabled: !!params.chatId && params.chatId !== "me",
  });

  if (isLoading && !chat) {
    return (
      <div className='flex min-h-dvh items-center-safe justify-center-safe bg-black text-white'>
        <Spinner />
      </div>
    );
  }

  return (
    <DashBoardLayout title={chat?.name || "dashboard"}>
      <>
        <ErrorBoundary FallbackComponent={ErrorElement}>
          <DashBoardSideBar />
        </ErrorBoundary>

        <ErrorBoundary FallbackComponent={ErrorElement}>
          <DashboardContent />
        </ErrorBoundary>
      </>
    </DashBoardLayout>
  );
}
