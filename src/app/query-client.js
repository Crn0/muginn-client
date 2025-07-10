import { QueryClient } from "@tanstack/react-query";

import { queryConfig } from "../lib";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...queryConfig,
    },
  },
});

export default queryClient;
