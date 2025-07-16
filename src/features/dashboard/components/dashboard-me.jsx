import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";

import { ErrorElement } from "../../../components/errors";

export default function DashBoardMe() {
  return (
    <ErrorBoundary fallbackRender={ErrorElement}>
      <Outlet />
    </ErrorBoundary>
  );
}
