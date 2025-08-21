import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { ApiClient, tryCatch } from "@/lib";
import { getInfiniteMessagesQueryOptions } from "./get-messages";
import type { CustomError } from "@/errors";

export type UseDeleteMessageOptions = UseMutationOptions<
  void,
  CustomError,
  {
    chatId: string;
    messageId: string;
  }
>;

export const deleteMessage = async ({
  chatId,
  messageId,
}: {
  chatId: string;
  messageId: string;
}) => {
  const { error } = await tryCatch(
    ApiClient.callApi(`chats/${chatId}/messages/${messageId}`, {
      authenticatedRequest: true,
      method: "DELETE",
    })
  );

  if (error) throw error;
};

export const useDeleteMessage = (chatId: string, options: UseDeleteMessageOptions = {}) => {
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
