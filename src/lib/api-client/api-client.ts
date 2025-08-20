import type { IConfigs } from "./types";

import { paths } from "@/configs";

import { RedirectError } from "@/errors";
import { generateHeader } from "@/lib/api/generate-header";
import { tryCatch } from "@/lib/try-catch";
import { callAPIWithoutToken, callAPIWithToken } from "./call-api";

interface IProvider {
  getToken: () => string | null;
  setToken: (token: string | null) => void;
  refreshToken: (signal?: AbortSignal) => Promise<string>;
}

interface IApiClient {
  baseUrl: string;
  refreshPromise: Promise<string> | null;
  provider: IProvider;
  callApi: (resource: string, configs: IConfigs) => Promise<Response>;
}

export class ApiClient implements IApiClient {
  private _baseUrl: string;

  private _refreshPromise: Promise<string> | null;

  private _provider: IProvider;

  private async waitForBackgroundRefresh() {
    if (this._refreshPromise) {
      const { error } = await tryCatch(this._refreshPromise);

      this._refreshPromise = null;

      if (error) throw error;
    }
  }

  constructor(baseURL: string, provider: IProvider) {
    this._baseUrl = baseURL;

    this._provider = provider;

    this._refreshPromise = null;

    if (!this._baseUrl.endsWith("/")) {
      this._baseUrl += "/";
    }
  }

  async callApi(resource: string, configs: IConfigs) {
    const conf = { ...configs };
    const url = `${this._baseUrl}${resource}`;

    if (!(conf?.headers instanceof Headers)) {
      conf.headers = generateHeader();
    }

    const { authenticatedRequest } = conf;

    if (!authenticatedRequest) return callAPIWithoutToken(url, conf);

    let token = this._provider.getToken();

    await this.waitForBackgroundRefresh();

    token = this._provider.getToken();

    // when the user authenticated using google auth get a new accessToken
    if (!token) {
      const redirectTo = window.location.pathname + window.location.search;

      const path = paths.silentLogin.getHref({ redirectTo });

      throw new RedirectError({
        message: "No valid access token, trying to silent login",
        redirectTo: path,
      });
    }

    const { error: firstResError, data: firstRes } = await tryCatch(
      callAPIWithToken(url, token, conf)
    );

    if (firstResError && firstResError?.code !== 401) {
      throw firstResError;
    }

    if (!firstResError) {
      return firstRes;
    }

    if (firstResError?.code === 401 && !this._refreshPromise) {
      this._refreshPromise = this._provider.refreshToken();

      const { error, data: newToken } = await tryCatch(this._refreshPromise);

      if (error?.code === 401 || error?.message === "Failed to fetch") throw error;

      this._provider.setToken(newToken);

      this._refreshPromise = null;
    }

    await this.waitForBackgroundRefresh();

    token = this._provider.getToken();

    if (!token) {
      const redirectTo = window.location.pathname + window.location.search;

      const path = paths.login.getHref({ redirectTo });

      throw new RedirectError({
        message: "No valid access token; redirecting to /login",
        redirectTo: path,
      });
    }

    const { error: secondResError, data: secondRes } = await tryCatch(
      callAPIWithToken(url, token, conf)
    );

    if (secondResError) throw secondResError;

    return secondRes;
  }

  get baseUrl() {
    return this._baseUrl;
  }

  get provider() {
    return this._provider;
  }

  get refreshPromise() {
    return this._refreshPromise;
  }
}
