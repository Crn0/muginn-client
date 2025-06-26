import { replace } from "react-router-dom";

import { paths } from "../../configs";
import { getAuthUserQueryOptions } from "../../lib";
import { getToken } from "../../stores";

export default function loader(queryClient) {
  return ({ request }) => {
    const redirectTo = new URL(request.url).pathname;

    if (!getToken()) {
      return replace(paths.silentLogin.getHref(redirectTo));
    }

    queryClient.ensureQueryData(getAuthUserQueryOptions().queryKey);

    return null;
  };
}
