import { replace } from "react-router-dom";

import { paths } from "../../configs";
import { getAuthUserQueryOptions } from "../../lib";

export default function loader(queryClient) {
  return ({ request }) => {
    const { searchParams } = new URL(request.url);

    const redirectTo = searchParams.get("redirectTo");

    const user = queryClient.getQueryData(getAuthUserQueryOptions().queryKey);

    if (!user) {
      return replace(paths.silentLogin.getHref(redirectTo));
    }

    return replace(redirectTo || paths.dashboard.getHref());
  };
}
