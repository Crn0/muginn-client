import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiClient, generateHeader, getAuthUserQueryOptions, tryCatch } from "../../../lib";

export const updateMainProfile = async (data) => {
  const headers = generateHeader();

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("users/me/profile", {
      headers,
      authenticatedRequest: true,
      method: "PATCH",
      body: data,
    })
  );

  if (error) throw error;

  return res.json();
};

export const useUpdateMainProfile = (options) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...restConfig } = options || {};

  const mutation = useMutation({
    ...restConfig,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getAuthUserQueryOptions().queryKey });

      onSuccess?.(...args);
    },
    onError: (e) => {
      onError?.(e);
    },
    mutationFn: (data) => updateMainProfile(data),
  });

  return mutation;
};
