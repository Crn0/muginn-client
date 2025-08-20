import z from "zod";

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { ValidationError } from "@/errors";
import { ApiClient, tryCatch } from "@/lib";
import { getChatsQueryOptions } from "./get-chats";

export type TJoinChat = z.infer<typeof joinChatChatSchema>;

export const joinChatChatSchema = z.object({
  chatId: z.string().uuid({ message: "Invalid invite" }),
});

export type UseJoinGroupChatOptions = UseMutationOptions<void, ValidationError, string>;

export const joinGroupChat = async (id: string) => {
  const { error } = await tryCatch(
    ApiClient.callApi(`chats/${id}/members`, {
      authenticatedRequest: true,
      method: "POST",
    })
  );

  if (error?.code === 404) {
    throw new ValidationError({
      message: "Something went wrong",
      fields: [
        {
          code: "custom",
          path: ["chatId"],
          message: error.message,
        },
      ],
    });
  }

  if (error) throw error;
};

export const useJoinGroupChat = (options?: UseJoinGroupChatOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restOption } = options || {};

  return useMutation({
    ...restOption,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getChatsQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    mutationFn: joinGroupChat,
  });
};
