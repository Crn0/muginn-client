import { env } from "../configs";
import refreshToken from "./refresh-token";
import { setToken, getToken } from "../stores";
import formatApiError from "./format-api-error";
import tryCatch from "./try-catch";

let refreshPromise = null;

const callAPIWithToken = async (url, token, configs) => {
  if (!configs.headers.get("Authorization")) {
    configs.headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...configs,
  });

  if (!res.ok) {
    const data = await res.json();

    const error = formatApiError(res, data);

    throw error;
  }

  return res;
};

const callAPIWithoutToken = async (url, configs) => {
  const res = await fetch(url, {
    ...configs,
  });

  if (!res.ok) {
    const data = await res.json();

    const error = formatApiError(res, data);

    throw error;
  }

  return res;
};

class ApiClient {
  #baseURL;

  #provider;

  constructor(baseURL, provider) {
    this.#baseURL = baseURL;

    this.#provider = provider;

    if (!this.#baseURL.endsWith("/")) {
      this.#baseURL += "/";
    }
  }

  async callApi(resource, configs) {
    const conf = { ...configs };
    const url = `${this.#baseURL}${resource}`;

    const { authenticatedRequest } = conf;

    if (!authenticatedRequest) return callAPIWithoutToken(url, conf);

    let token = this.#provider.getToken();

    if (refreshPromise !== null) {
      const { e } = await tryCatch(refreshPromise);

      if (e.code === 401) throw e;

      token = this.#provider.getToken();
      refreshPromise = null;
    }

    // when the user authenticated using google auth get a new accessToken
    if (!token) {
      refreshPromise = this.#provider.refreshToken();

      const { e, data: newToken } = await tryCatch(refreshPromise);

      if (e.code === 401) throw e;

      this.#provider.setToken(newToken);

      token = newToken;
      refreshPromise = null;
    }

    const { error: invalidAccessTokenError, data: firstRes } = await tryCatch(() =>
      callAPIWithToken(url, token, conf)
    );

    if (!invalidAccessTokenError && firstRes) {
      return firstRes;
    }

    if (invalidAccessTokenError.code === 401) {
      refreshPromise = this.#provider.refreshToken();

      const { e, data: newToken } = await tryCatch(refreshPromise);

      if (e.code === 401) throw e;

      this.#provider.setToken(newToken);

      token = newToken;
      refreshPromise = null;
    }

    const { error: resError, data: secondRes } = await tryCatch(() =>
      callAPIWithToken(url, token, conf)
    );

    if (resError) throw resError;

    return secondRes;
  }
}

const serverUrl = env.getValue("serverUrl");
const apiVersion = `v${env.getValue("apiVersion")}`;
const baseURL = `${serverUrl}/api/${apiVersion}`;

const provider = {
  setToken,
  getToken,
  refreshToken,
};

export default Object.freeze(new ApiClient(baseURL, provider));
