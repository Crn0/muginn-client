import { Outlet, useParams } from "react-router-dom";
import { useEffect } from "react";

import { hasTouchSupport } from "../../../lib";
import { useChat } from "../../chats/api";
import { useDashboardDrawer } from "../../../components/layouts/context";
import { Spinner } from "../../../components/ui/spinner";

export default function DashboardContent() {
  const params = useParams();

  const chatQuery = useChat(params.chatId, {
    enabled: !!params.chatId && params.chatId !== "me",
  });

  const drawer = useDashboardDrawer(DashboardContent);

  useEffect(() => {
    if (chatQuery.data && hasTouchSupport() && drawer.isAutoDrawer) {
      drawer.manual();
      drawer.close();
    }
  }, [chatQuery.data, drawer]);

  if (chatQuery.isLoading && !chatQuery.data)
    return (
      <div className='flex flex-1 items-center-safe justify-center-safe bg-black text-white'>
        <Spinner />
      </div>
    );

  if (chatQuery.isError && !chatQuery.data) return null;

  return (
    <div className='flex flex-1'>
      <Outlet />
    </div>
  );
}
