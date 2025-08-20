import { ApiClient } from "../api-client";
import { errorHandler } from "../errors/error-handler";
import { tryCatch } from "../try-catch";

export const refreshToken = async (signal?: AbortSignal): Promise<string> => {
  const { error, data: res } = await tryCatch(
    ApiClient.callApi("auth/refresh-tokens", {
      signal,
      authenticatedRequest: false,
      method: "POST",
    })
  );

  if (error) {
    throw errorHandler(error);
  }

  const token = (await res.json()).token;

  return token;
};
