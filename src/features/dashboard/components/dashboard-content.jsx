import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { Spinner } from "../../../components/ui/spinner";

export default function DashboardContent() {
  return (
    <div className='flex flex-1'>
      <Suspense
        fallback={
          <div className='flex flex-1 items-center-safe justify-center-safe bg-black text-white'>
            <Spinner />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </div>
  );
}
