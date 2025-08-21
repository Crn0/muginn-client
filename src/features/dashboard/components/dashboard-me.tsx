import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";

import { ErrorElement } from "@/components/errors";

export function DashBoardMe() {
  return (
    <ErrorBoundary fallbackRender={ErrorElement}>
      <Outlet />
    </ErrorBoundary>
  );
}
