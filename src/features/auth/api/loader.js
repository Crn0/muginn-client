import { replace } from "react-router-dom";

import { paths } from "../../../configs";
import { tryCatch } from "../../../lib";
import refreshToken from "../../../lib/refresh-token";
import { setToken } from "../../../stores";

export const getRefreshToken = async (request) => {
  const { error, data: token } = await tryCatch(refreshToken());

  const redirectTo = new URL(request.url).pathname;

  if (error?.code >= 500 || error?.message === "Failed to Fetch") throw error;

  if (error?.code === 401) return replace(paths.login.getHref(redirectTo));

  setToken(token);

  return token;
};

export function clientLoader({ request }) {
  return { data: getRefreshToken(request) };
}
