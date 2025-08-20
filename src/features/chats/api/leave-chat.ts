import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { ApiClient, tryCatch } from "@/lib";
import { getChatsQueryOptions } from "./get-chats";
import type { CustomError } from "@/errors";

export type UseLeaveGroupChatOptions = UseMutationOptions<void, CustomError, string>;

export const leaveGroupChat = async (id: string) => {
  const { error } = await tryCatch(
    ApiClient.callApi(`chats/${id}/members/me`, {
      authenticatedRequest: true,
      method: "DELETE",
    })
  );

  if (error) throw error;
};

export const useLeaveGroupChat = (options?: UseLeaveGroupChatOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restOption } = options || {};

  return useMutation({
    ...restOption,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getChatsQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    mutationFn: leaveGroupChat,
  });
};
