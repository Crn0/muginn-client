import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiClient, generateHeader, getAuthUserQueryOptions, tryCatch } from "../../../lib";
import { resetStore } from "../../../stores";

export const updateUsername = async (data) => {
  const headers = generateHeader(["Content-Type", "application/json"]);

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("users/me/username", {
      headers,
      authenticatedRequest: true,
      method: "PATCH",
      body: JSON.stringify(data),
    })
  );

  if (error) throw error;

  return res.json();
};

export const updatePassword = async (data) => {
  const headers = generateHeader(["Content-Type", "application/json"]);

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("users/me/password", {
      headers,
      authenticatedRequest: true,
      method: "PATCH",
      body: JSON.stringify(data),
      credentials: "include",
    })
  );

  if (error) throw error;

  return res;
};

const updateAccountProfile = (queryClient) => async (data) => {
  const intent = data?.intent;

  if (intent === "update:accountProfile:username") {
    const { error, data: resData } = await tryCatch(updateUsername(data));

    if (error) throw error;

    queryClient.invalidateQueries(getAuthUserQueryOptions().queryKey);

    return resData;
  }

  if (intent === "update:accountProfile:password") {
    const { error, data: res } = await tryCatch(updatePassword(data));

    if (error) throw error;

    queryClient.clear();

    resetStore();

    return res;
  }

  throw new Error("Invalid intent");
};

export const useUpdateAccountProfile = (options = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restConfig } = options || {};

  return useMutation({
    ...restConfig,
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    onError: (e) => {
      onError?.(e);
    },
    mutationFn: (data) => updateAccountProfile(queryClient)(data),
  });
};
