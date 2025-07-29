import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiClient, tryCatch } from "../../../lib";
import { getChatsQueryOptions } from "./get-chats";
import { getChatQueryOptions } from "./get-chat";

export const deleteChat = async (id) => {
  const { error, data: res } = await tryCatch(
    ApiClient.callApi(`chats/${id}`, {
      authenticatedRequest: true,
      method: "DELETE",
    })
  );

  if (error) throw error;

  return res;
};

export const useDeleteChat = (id, options = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restOption } = options;

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
