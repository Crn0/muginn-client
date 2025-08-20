import { ApiClient } from "@/lib/api-client";
import { tryCatch } from "@/lib";
import { errorHandler } from "@/lib/errors";

export const logout = async () => {
  const { error, data: res } = await tryCatch(
    ApiClient.callApi("auth/logout", {
      authenticatedRequest: true,
      method: "POST",
      credentials: "include",
    }),
    () => {}
  );

  if (error) {
    throw errorHandler(error);
  }

  return res;
};
