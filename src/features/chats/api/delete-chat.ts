import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import type { CustomError } from "@/errors";

import { ApiClient, tryCatch } from "@/lib";
import { getChatsQueryOptions } from "./get-chats";
import { getChatQueryOptions } from "./get-chat";

export type UseDeleteChatOptions = UseMutationOptions<void, CustomError>;

export const deleteChat = async (id: string) => {
  const { error } = await tryCatch(
    ApiClient.callApi(`chats/${id}`, {
      authenticatedRequest: true,
      method: "DELETE",
    })
  );

  if (error) throw error;
};

export const useDeleteChat = (id: string, options?: UseDeleteChatOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restOption } = options || {};

  return useMutation({
    ...restOption,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getChatsQueryOptions().queryKey });
      queryClient.resetQueries({ queryKey: getChatQueryOptions(id).queryKey, exact: true });
      onSuccess?.(...args);
    },
    mutationFn: () => deleteChat(id),
  });
};
