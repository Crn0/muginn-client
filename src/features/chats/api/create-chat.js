import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiClient, tryCatch } from "../../../lib";
import { getChatsQueryOptions } from "./get-chats";

export const createChat = async (formData) => {
  if (formData.get("isMultiForm") === "false") {
    formData.delete("avatar");
  }

  formData.delete("isMultiForm");

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("chats", {
      authenticatedRequest: true,
      method: "POST",
      body: formData,
    })
  );

  if (error) throw error;

  const resData = await res.json();

  return resData;
};

export const useCreateChat = (options = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restOption } = options;

  return useMutation({
    ...restOption,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getChatsQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    mutationFn: createChat,
  });
};
