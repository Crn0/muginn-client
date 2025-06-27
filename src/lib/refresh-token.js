import { env } from "../configs";
import formatApiError from "./format-api-error";

export default async function refreshToken(signal) {
  const url = `${env.getValue("serverUrl")}/api/v${env.getValue("apiVersion")}/auth/refresh-tokens`;

  const res = await fetch(url, { signal, method: "POST", credentials: "include" });

  if (!res.ok) {
    const errorData = await res.json();

    const error = formatApiError(res, errorData);

    throw error;
  }

  const { token } = await res.json();

  return token;
}
