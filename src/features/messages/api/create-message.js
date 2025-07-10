import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiClient, tryCatch } from "../../../lib";
import { getInfiniteMessagesQueryOptions } from "./get-messages";

export const createMessage = (chatId) => async (formData) => {
  const { error, data: res } = await tryCatch(
    ApiClient.callApi(`chats/${chatId}/messages`, {
      authenticatedRequest: true,
      method: "POST",
      body: formData,
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
