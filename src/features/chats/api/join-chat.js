import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiClient, tryCatch } from "../../../lib";
import { getChatsQueryOptions } from "./get-chats";

export const joinGroupChat = async ({ chatId }) => {
  const { error } = await tryCatch(
    ApiClient.callApi(`chats/${chatId}/members`, {
      authenticatedRequest: true,
      method: "POST",
    })
  );

  if (error) throw error;
};

export const useJoinGroupChat = (options = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restOption } = options;

  return useMutation({
    ...restOption,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getChatsQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    mutationFn: joinGroupChat,
  });
};
