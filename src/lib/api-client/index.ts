import { env } from "@/configs";
import { getToken, setToken } from "@/stores";
import { refreshToken } from "@/lib/api/refresh-token";

import { ApiClient as Client } from "@/lib/api-client/api-client";

const serverUrl = env.SERVER_URL;
const apiVersion = `v${env.API_VERSION}`;
const baseURL = `${serverUrl}/api/${apiVersion}`;

const provider = {
  setToken,
  getToken,
  refreshToken,
};

export const ApiClient = Object.freeze(new Client(baseURL, provider));
