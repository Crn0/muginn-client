import { QueryClient } from "@tanstack/react-query";

import { queryConfig } from "@/lib";

export const queryClient = new QueryClient({
  defaultOptions: {
    ...queryConfig,
  },
});
