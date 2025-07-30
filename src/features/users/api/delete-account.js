import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiClient, generateHeader, tryCatch } from "../../../lib";
import { resetStore as resetAuthStore } from "../../../stores";

export const deleteAccount = async () => {
  const headers = generateHeader(["Content-Type", "application/json"]);

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("users/me", {
      headers,
      authenticatedRequest: true,
      method: "DELETE",
    })
  );

  if (error) throw error;

  return res;
};

export const useDeleteAccount = (options = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restConfig } = options || {};

  return useMutation({
    ...restConfig,
    onSuccess: (...args) => {
      queryClient.clear();
      resetAuthStore();
      onSuccess?.(...args);
    },
    onError: (e) => {
      onError?.(e);
    },
    mutationFn: deleteAccount,
  });
};
