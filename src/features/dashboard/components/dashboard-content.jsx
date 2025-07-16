import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { Spinner } from "../../../components/ui/spinner";

export default function DashboardContent() {
  return (
    <div className='flex-1'>
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
