import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useParams } from "react-router-dom";

import { hasTouchSupport } from "@/lib";
import { getChatQueryOptions } from "@/features/chats/api";
import { useDashboardDrawer } from "@/components/layouts/context";
import { Spinner } from "@/components/ui/spinner";

export function DashboardContent() {
  const params = useParams();

  const chatQuery = useQuery({
    ...getChatQueryOptions(params.chatId ?? ""),
    enabled: !!params.chatId && params.chatId !== "me",
  });

  const drawer = useDashboardDrawer();

  useEffect(() => {
    if (chatQuery.data && drawer.isAutoDrawer && hasTouchSupport()) {
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
