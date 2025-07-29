import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiClient, generateHeader, tryCatch } from "../../../lib";
import { getChatQueryOptions } from "./get-chat";
import { getChatsQueryOptions } from "./get-chats";

export const updateChatProfile = async (chatId, formData) => {
  const headers = generateHeader();

  const { error, data: res } = await tryCatch(
    ApiClient.callApi(`chats/${chatId}/profile`, {
      headers,
      authenticatedRequest: true,
      method: "PATCH",
      body: formData,
    })
  );

  if (error) throw error;

  return res.json();
};

export const useUpdateChatProfile = (id, options) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...restConfig } = options || {};

  return useMutation({
    ...restConfig,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: getChatsQueryOptions().queryKey });
      queryClient.invalidateQueries({ queryKey: getChatQueryOptions(id).queryKey });

      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      onError?.(error, variables, context);
    },
    mutationFn: (data) => updateChatProfile(id, data),
  });
};
