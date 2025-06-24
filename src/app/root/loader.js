import { replace } from "react-router-dom";

import { paths } from "../../configs";
import { getAuthUserQueryOptions } from "../../lib";

export default function loader(queryClient) {
  return ({ request }) => {
    const user = queryClient.getQueryData(getAuthUserQueryOptions().queryKey);

    const redirectTo = new URL(request.url).pathname;

    if (!user) {
      return replace(paths.silentLogin.getHref(redirectTo));
    }

    return null;
  };
}
