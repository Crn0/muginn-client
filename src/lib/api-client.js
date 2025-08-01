import { env, paths } from "../configs";
import generateHeader from "./generate-header";
import refreshToken from "./refresh-token";
import { setToken, getToken } from "../stores";
import errorHandler from "./error-handler";
import tryCatch from "./try-catch";

let refreshPromise = null;

const callAPIWithToken = async (url, token, configs) => {
  configs.headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, {
    ...configs,
  });

  if (!res.ok) {
    const data = await res.json();

    errorHandler(res, data);
  }

  return res;
};

const callAPIWithoutToken = async (url, configs) => {
  const res = await fetch(url, {
    ...configs,
  });

  if (!res.ok) {
    const data = await res.json();

    errorHandler(res, data);
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

    if (!(conf?.headers instanceof Headers)) {
      conf.headers = generateHeader();
    }

    const { authenticatedRequest } = conf;

    if (!authenticatedRequest) return callAPIWithoutToken(url, conf);

    let token = this.#provider.getToken();

    if (refreshPromise !== null) {
      const { error } = await tryCatch(refreshPromise);

      if (error?.code === 401 || error?.message === "Failed to fetch") throw error;

      token = this.#provider.getToken();
      refreshPromise = null;
    }

    // when the user authenticated using google auth get a new accessToken
    if (!token) {
      const redirectTo = window.location.pathname + window.location.search;

      return window.location.replace(paths.silentLogin.getHref({ redirectTo }));
    }

    const { error: firstResError, data: firstRes } = await tryCatch(() =>
      callAPIWithToken(url, token, conf)
    );

    if (firstResError && firstResError?.code !== 401) {
      throw firstResError;
    }

    if (!firstResError) {
      return firstRes;
    }

    if (firstResError?.code === 401) {
      refreshPromise = this.#provider.refreshToken();

      const { error, data: newToken } = await tryCatch(refreshPromise);

      if (error?.code === 401 || error?.message === "Failed to fetch") throw error;

      this.#provider.setToken(newToken);

      token = newToken;
      refreshPromise = null;
    }

    const { error: secondResError, data: secondRes } = await tryCatch(() =>
      callAPIWithToken(url, token, conf)
    );

    if (secondResError) throw secondResError;

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
