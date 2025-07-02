import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiClient, generateHeader, tryCatch } from "../../../lib";
import { getChatsQueryOptions } from "./get-chats";

export const createChat = (queryClient) => async (request) => {
  const headers = generateHeader();

  const contentType = request.headers.get("Content-type");

  const isMultiForm = contentType.includes("multipart/form-data");

  const formData = await request.clone().formData();

  formData.delete("intent");

  if (!isMultiForm) {
    formData.delete("avatar");
  }

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("chats", {
      headers,
      authenticatedRequest: true,
      method: "POST",
      body: formData,
    })
  );

  if (error) throw error;

  const resData = await res.json();

  if (resData) {
    queryClient.invalidateQueries({ queryKey: getChatsQueryOptions().queryKey });
  }

  return resData;
};

export const useCreateChat = (options) => {
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
