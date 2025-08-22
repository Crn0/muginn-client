import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import { paths } from "@/configs";
import { getAuthUserQueryOptions } from "@/lib";
import { ErrorElement } from "@/components/errors";
import { Spinner } from "@/components/ui/spinner";

export function ProtectedRoute() {
  const location = useLocation();
  const navigate = useNavigate();

  const { isLoading, data, isError } = useQuery({
    ...getAuthUserQueryOptions(),
  });

  useEffect(() => {
    if (data && location.pathname === "/") {
      navigate(paths.protected.dashboard.me.getHref());
    }

    if (isError) {
      navigate(paths.login.getHref({ redirectTo: location.pathname }));
    }
  }, [data, isError, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className='flex min-h-dvh items-center-safe justify-center-safe bg-black text-white'>
        <Spinner />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div>
          <Spinner />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={ErrorElement}>
        <Outlet />
      </ErrorBoundary>
    </Suspense>
  );
}
