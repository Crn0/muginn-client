import { env } from "../configs";
import formatApiError from "./format-api-error";
import generateHeader from "./generate-header";

export default async function refreshToken() {
  const url = `${env.getValue("serverUrl")}/api/v${env.getValue("apiVersion")}/auth/refresh-tokens`;

  const headers = generateHeader(["Content-Type", "application/json"]);

  const res = await fetch(url, { headers, method: "POST", credentials: "include" });

  if (!res.ok) {
    const errorData = await res.json();

    const error = formatApiError(res, errorData);

    throw error;
  }

  return res.json();
}
