import { useMutation } from "@tanstack/react-query";

import { ApiClient, generateHeader, getAuthUserQueryOptions, tryCatch } from "../../../lib";

export const updateMainProfile = async (data) => {
  const headers = generateHeader(["Content-Type", "multipart/form-data"]);

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("users/me/profile", {
      headers,
      authenticatedRequest: true,
      method: "POST",
      body: JSON.stringify(data),
    })
  );

  if (error) throw error;

  return res.json();
};

export const updateMainProfileAction =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();

    const updates = Object.fromEntries(formData);

    const { error, data } = await tryCatch(updateMainProfile(updates));

    if (
      (typeof error?.code === "number" && error?.code !== 422) ||
      error?.message === "Failed to fetch"
    ) {
      throw error;
    }

    if (data) {
      queryClient.invalidateQueries({ queryKey: getAuthUserQueryOptions().queryKey });
    }

    return { error, data };
  };

export const useUpdateMainProfile = (options) => {
  const { onSuccess, onError, ...restConfig } = options || {};

  const mutation = useMutation({
    ...restConfig,
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    onError: (e) => {
      onError?.(e);
    },
    mutationFn: (data) => updateMainProfile(data),
  });

  return mutation;
};
