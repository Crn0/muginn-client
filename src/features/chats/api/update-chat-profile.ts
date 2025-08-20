import z from "zod";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import type { ValidationError } from "@/errors";

import { ApiClient, generateHeader, tryCatch } from "@/lib";
import { getChatQueryOptions } from "./get-chat";
import { getChatsQueryOptions } from "./get-chats";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "./create-chat";

export const MAX_NAME_LEN = 36;

export type UpdateChatResponse = {
  id: string;
};

export type TUpdateChat = z.infer<typeof chatProfileSchema>;

export type UseUpdateChatOptions = UseMutationOptions<
  UpdateChatResponse,
  ValidationError,
  TUpdateChat
>;

export const chatProfileSchema = z.object({
  name: z
    .string({ message: `Name must contain at most ${MAX_NAME_LEN} character(s)` })
    .trim()
    .max(MAX_NAME_LEN)
    .optional(),
  avatar: z
    .instanceof(FileList)
    .refine((file) => file.length <= 1, "Upload only one image at a time")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .refine(
      (file) => (file.length === 1 ? file[0]?.size <= MAX_FILE_SIZE : true),
      "Max image size is 10MB"
    )
    .optional(),
});

export const updateChatProfile = async (id: string, data: TUpdateChat) => {
  const headers = generateHeader();

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof FileList) {
      if (value[0]) {
        formData.append(key, value[0]);
      }

      return;
    }

    formData.append(key, value);
  });

  const { error, data: res } = await tryCatch(
    ApiClient.callApi(`chats/${id}/profile`, {
      headers,
      authenticatedRequest: true,
      method: "PATCH",
      body: formData,
    })
  );

  if (error) throw error;

  return res.json();
};

export const useUpdateChatProfile = (id: string, options?: UseUpdateChatOptions) => {
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
