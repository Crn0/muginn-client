import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import type { CustomError } from "@/errors";
import { ApiClient, generateHeader, tryCatch } from "@/lib";
import { resetStore as resetAuthStore } from "@/stores";

export type UseDeleteAccountOptions = UseMutationOptions<void, CustomError>;

export const deleteAccount = async () => {
  const headers = generateHeader(["Content-Type", "application/json"]);

  const { error } = await tryCatch(
    ApiClient.callApi("users/me", {
      headers,
      authenticatedRequest: true,
      method: "DELETE",
    })
  );

  if (error) throw error;
};

export const useDeleteAccount = (options?: UseDeleteAccountOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restConfig } = options || {};

  return useMutation({
    ...restConfig,
    onSuccess: (...args) => {
      queryClient.clear();
      resetAuthStore();
      onSuccess?.(...args);
    },
    onError: (...args) => {
      onError?.(...args);
    },
    mutationFn: deleteAccount,
  });
};
