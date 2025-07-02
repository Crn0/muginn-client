import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import queryClient from "./query-client";

export default function App() {
  return (
    <Suspense fallback={<p>loading....</p>}>
      <ErrorBoundary fallback={<p>error</p>}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />
          <Outlet />
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  );
}
