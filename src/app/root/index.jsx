import { Outlet, useNavigate } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import { paths } from "../../configs";
import { getAuthUserQueryOptions } from "../../lib";
import { ErrorElement } from "../../components/errors";
import { Spinner } from "../../components/ui/spinner";

export default function ProtectedRoot() {
  const navigate = useNavigate();

  const { isLoading, data } = useQuery({ ...getAuthUserQueryOptions() });

  useEffect(() => {
    if (data) {
      navigate(paths.protected.dashboard.me.getHref());
    }
  }, [data, navigate]);

  if (isLoading) {
    return (
      <div>
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
      <ErrorBoundary fallback={<ErrorElement />}>
        <Outlet />
      </ErrorBoundary>
    </Suspense>
  );
}
