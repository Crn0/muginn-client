import type { QueryClient } from "@tanstack/react-query";
import { replace, type ActionFunctionArgs } from "react-router-dom";

import { paths } from "@/configs";
import { getAuthUserQueryOptions } from "@/lib";
import { getToken } from "@/stores";

export const loader =
  (queryClient: QueryClient) =>
  ({ request }: ActionFunctionArgs) => {
    const redirectTo = new URL(request.url).pathname;

    if (!getToken()) {
      queryClient.clear();
      return replace(paths.silentLogin.getHref({ redirectTo }));
    }

    queryClient.ensureQueryData({
      ...getAuthUserQueryOptions(),
    });

    return null;
  };
