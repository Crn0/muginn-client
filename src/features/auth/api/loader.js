import { tryCatch } from "../../../lib";
import refreshToken from "../../../lib/refresh-token";
import { setToken } from "../../../stores";

export const getRefreshToken = async () => {
  const { error, data: token } = await tryCatch(refreshToken());

  if (error?.code >= 500 || error?.message?.toLowerCase() === "failed to fetch") throw error;

  if (error?.code === 401) return null;

  setToken(token);

  return token;
};

export function clientLoader({ request }) {
  return { data: getRefreshToken(request) };
}
