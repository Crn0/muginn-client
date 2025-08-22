import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import { queryClient } from "./query-client";
import { ErrorElement } from "@/components/errors";
import { Spinner } from "@/components/ui/spinner";

export default function App() {
  return (
    <Suspense
      fallback={
        <div>
          <Spinner />
        </div>
      }
    >
      <ErrorBoundary fallbackRender={ErrorElement}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />
          <Outlet />
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  );
}
