import { env } from "../configs";
import errorHandler from "./error-handler";

export default async function refreshToken(signal) {
  const url = `${env.getValue("serverUrl")}/api/v${env.getValue("apiVersion")}/auth/refresh-tokens`;

  const res = await fetch(url, { signal, method: "POST", credentials: "include" });

  if (!res.ok) {
    const errorData = await res.json();

    errorHandler(res, errorData);
  }

  const { token } = await res.json();

  return token;
}
