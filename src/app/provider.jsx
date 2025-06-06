import PropTypes from "prop-types";
import { Suspense, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import { queryConfig } from "../lib";

export default function AppProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );

  return (
    <Suspense fallback={<p>loading....</p>}>
      <ErrorBoundary fallback={<p>error</p>}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  );
}

AppProvider.propTypes = {
  children: PropTypes.element,
};
