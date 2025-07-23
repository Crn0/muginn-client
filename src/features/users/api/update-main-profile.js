import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiClient, generateHeader, getAuthUserQueryOptions, tryCatch } from "../../../lib";

export const deleteBackgroundAvatar = async () => {
  const headers = generateHeader();

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("users/me/profile/background-avatar", {
      headers,
      authenticatedRequest: true,
      method: "DELETE",
    })
  );

  if (error) throw error;

  return res;
};

export const deleteAvatar = async () => {
  const headers = generateHeader();

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("users/me/profile/avatar", {
      headers,
      authenticatedRequest: true,
      method: "DELETE",
    })
  );

  if (error) throw error;

  return res;
};

export const updateProfile = async (data) => {
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

export const updateMainProfile = async (formData) => {
  const intent = formData.get("intent");

  if (intent === "update:mainProfile") return updateProfile(formData);

  if (intent === "delete:backgroundAvatar") return deleteBackgroundAvatar();

  if (intent === "delete:avatar") return deleteAvatar();

  throw Error(`invalid ${intent}`);
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
