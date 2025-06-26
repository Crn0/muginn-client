import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiClient, generateHeader, tryCatch } from "../../../lib";
import { getChatsQueryOptions } from "./get-chats";

export const createChat = async (request) => {
  const headers = generateHeader();

  const contentType = request.headers.get("Content-type");

  const isMultiForm = contentType.includes("multipart/form-data");

  const data = await request.clone().formData();

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("chats", {
      headers,
      authenticatedRequest: true,
      method: "POST",
      body: isMultiForm ? data : JSON.stringify(data),
    })
  );

  if (error) throw error;

  return res.json();
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
