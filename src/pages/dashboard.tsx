import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getChatQueryOptions } from "@/features/chats/api";
import { ErrorElement } from "@/components/errors";
import { DashboardLayout } from "@/components/layouts";
import { DashBoardSideBar, DashboardContent } from "@/features/dashboard/components";

export function DashBoard() {
  const params = useParams();

  const { data: chat } = useQuery({
    ...getChatQueryOptions(params.chatId ?? ""),
    enabled: !!params.chatId && params.chatId !== "me",
  });

  return (
    <DashboardLayout title={chat?.name || "dashboard"}>
      <>
        <ErrorBoundary FallbackComponent={ErrorElement}>
          <DashBoardSideBar />
        </ErrorBoundary>

        <ErrorBoundary FallbackComponent={ErrorElement}>
          <DashboardContent />
        </ErrorBoundary>
      </>
    </DashboardLayout>
  );
}
