import { ErrorBoundary } from "react-error-boundary";

import { ErrorElement } from "../../../components/errors";
import DashboardSidebarContent from "./dashboard-sidebar-content";

export default function DashBoardSideBar() {
  return (
    <div className='hidden sm:flex'>
      <ErrorBoundary fallbackRender={ErrorElement}>
        <DashboardSidebarContent />
      </ErrorBoundary>
    </div>
  );
}
