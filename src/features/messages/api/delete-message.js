import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiClient, tryCatch } from "../../../lib";
import { getInfiniteMessagesQueryOptions } from "./get-messages";

export const deleteMessage = async ({ chatId, messageId }) => {
  const { error } = await tryCatch(
    ApiClient.callApi(`chats/${chatId}/messages/${messageId}`, {
      authenticatedRequest: true,
      method: "DELETE",
    })
  );

  if (error) throw error;
};

export const useDeleteMessage = ({ chatId }, options = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restOption } = options;

  return useMutation({
    ...restOption,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getInfiniteMessagesQueryOptions(chatId).queryKey });
      onSuccess?.(...args);
    },
    mutationFn: deleteMessage,
  });
};
