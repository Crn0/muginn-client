import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { Spinner } from "../../../components/ui/spinner";

const initCondition = (params, location) => (action) => {
  if (action === "direct:list") {
    return location.pathname === "/chats/me" || location.pathname === "/chats";
  }

  if (action === "direct:view") {
    return location.pathname.startsWith("/chats/me/") && !!params.chatId;
  }

  if (action === "group:view") {
    return (
      location.pathname.startsWith("/chats/") &&
      !location.pathname.startsWith("/chats/me") &&
      !!params.chatId
    );
  }

  throw new Error("Invalid action");
};

export default function DashboardContent() {
  return (
    <div>
      <Suspense
        fallback={
          <div>
            <Spinner />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </div>
  );
}
