import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiClient, tryCatch } from "../../../lib";
import { getChatsQueryOptions } from "./get-chats";

export const leaveGroupChat = async ({ id }) => {
  const { error } = await tryCatch(
    ApiClient.callApi(`chats/${id}/members/me`, {
      authenticatedRequest: true,
      method: "DELETE",
    })
  );

  if (error) throw error;
};

export const useLeaveGroupChat = (options = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restOption } = options;

  return useMutation({
    ...restOption,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getChatsQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    mutationFn: leaveGroupChat,
  });
};
