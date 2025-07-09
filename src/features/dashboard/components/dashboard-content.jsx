import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { Spinner } from "../../../components/ui/spinner";

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
