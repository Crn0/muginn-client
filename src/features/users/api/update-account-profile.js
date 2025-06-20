import { redirect } from "react-router-dom";
import { ApiClient, generateHeader, getAuthUserQueryOptions, tryCatch } from "../../../lib";
import { paths } from "../../../configs";
import { resetStore } from "../../../stores";

export const updateUsername = async (data) => {
  const headers = generateHeader();

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
  const headers = generateHeader();

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("users/me/password", {
      headers,
      authenticatedRequest: true,
      method: "PATCH",
      body: JSON.stringify(data),
    })
  );

  if (error) throw error;

  return res;
};

export const updateAccountProfileAction = (queryClient) => async (formData) => {
  const intent = formData.get("intent");

  formData.delete("intent");

  const updates = Object.fromEntries(formData);

  const handleUpdate = async (updater) => {
    const { error, data } = await tryCatch(updater(updates));

    if (
      (typeof error?.code === "number" && error?.code !== 422) ||
      error?.message === "Failed to fetch"
    ) {
      throw error;
    }

    return { error, data };
  };

  if (intent === "update:accountProfile:username") {
    const { error, data } = await handleUpdate(updateUsername);

    if (data) {
      queryClient.invalidateQueries({ queryKey: getAuthUserQueryOptions().queryKey });
    }

    return { error, data };
  }

  if (intent === "update:accountProfile:password") {
    const { error, data } = await handleUpdate(updatePassword);

    if (data) {
      queryClient.removeQueries({ queryKey: getAuthUserQueryOptions().queryKey });

      resetStore();

      return redirect(paths.login.getHref(window.location.pathname));
    }

    return { error, data: null };
  }

  throw new Error("Invalid intent");
};
