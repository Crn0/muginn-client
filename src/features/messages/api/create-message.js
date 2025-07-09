import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiClient, generateHeader, tryCatch } from "../../../lib";
import { getInfiniteMessagesQueryOptions } from "./get-messages";

export const createMessage = (chatId) => async (data) => {
  const headers = generateHeader();

  const { error, data: res } = await tryCatch(
    ApiClient.callApi(`chats/${chatId}/messages`, {
      headers,
      authenticatedRequest: false,
      method: "POST",
      body: data,
    })
  );

  if (error) throw error;

  return res.json();
};

export const useCreateMessage = (chatId, options = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restOption } = options;

  return useMutation({
    ...restOption,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getInfiniteMessagesQueryOptions(chatId).queryKey });
      onSuccess?.(...args);
    },
    mutationFn: createMessage(chatId),
  });
};
