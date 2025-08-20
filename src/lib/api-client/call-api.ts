import type { IConfigs } from "./types";

import { InvalidError } from "@/errors";
import { errorHandler } from "@/lib/errors";
import { handleResponseError } from "@/lib/errors";

export const callAPIWithToken = async (
  url: string,
  token: string,
  configs: IConfigs
): Promise<Response> => {
  if (!configs.headers)
    throw new InvalidError({
      message: "Missing required 'configs.headers' in 'callAPIWithToken'",
      isOperational: false,
    });

  configs.headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, {
    ...configs,
  });

  const resError = await handleResponseError(res);

  if (resError) {
    throw errorHandler(resError);
  }

  return res;
};

export const callAPIWithoutToken = async (url: string, configs: IConfigs): Promise<Response> => {
  const res = await fetch(url, {
    ...configs,
  });

  const resError = await handleResponseError(res);

  if (resError) {
    throw errorHandler(resError);
  }

  return res;
};
