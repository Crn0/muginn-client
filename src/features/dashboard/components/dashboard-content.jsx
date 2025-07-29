import { Outlet, useParams } from "react-router-dom";

import { useChat } from "../../chats/api";
import { Spinner } from "../../../components/ui/spinner";

export default function DashboardContent() {
  const params = useParams();

  const chatQuery = useChat(params.chatId, {
    enabled: !!params.chatId && params.chatId !== "me",
  });

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
