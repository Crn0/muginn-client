import type { CustomError } from "@/errors";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { ApiClient } from "@/lib/api-client";
import { tryCatch } from "@/lib/try-catch";
import { errorHandler } from "@/lib/errors/error-handler";
import { resetStore } from "@/stores";

export type UseLogoutOptions = UseMutationOptions<Response, CustomError>;

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

export const useLogout = (options?: UseLogoutOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...rest } = options || {};

  return useMutation({
    ...rest,
    mutationFn: logout,
    onSuccess: (...args) => {
      queryClient.clear();
      resetStore();
      onSuccess?.(...args);
    },
    onError: (...args) => {
      onError?.(...args);
    },
  });
};
