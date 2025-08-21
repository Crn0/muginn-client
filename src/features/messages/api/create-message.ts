import z from "zod";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import type { ValidationError } from "@/errors";

import { ApiClient, tryCatch } from "@/lib";
import { getInfiniteMessagesQueryOptions, type TMessage } from "./get-messages";

export type TCreateMessage = z.infer<typeof createMessageSchema>;

export type UseCreateMessageOptions = UseMutationOptions<TMessage, ValidationError, TCreateMessage>;

export const MAX_ATTACHMENTS_LENGTH = 5;
export const MAX_CONTENT_LENGTH = 2000;

export const MAX_FILE_SIZE = 10_000_000; // 10mb

export const ACCEPTED_ATTACHMENTS_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/epub+zip",
  "application/pdf",
];

export const createMessageSchema = z.object({
  content: z.string().trim().max(MAX_CONTENT_LENGTH).default(""),
  attachments: z.preprocess(
    (value) => {
      if (!value) return [];

      if (value instanceof FileList && value.length <= 0) return [];

      return Array.isArray(value) ? value : [value];
    },
    z
      .array(z.instanceof(File))
      .max(MAX_ATTACHMENTS_LENGTH, {
        message: `You can only upload ${MAX_ATTACHMENTS_LENGTH} files at a time!`,
      })
      .refine(
        (files) =>
          Array.from(files).every((file) => ACCEPTED_ATTACHMENTS_TYPES.includes(file.type)),
        "Only .jpg, .jpeg, .png, .webp, epub and pdf formats are supported."
      )
      .refine(
        (files) => Array.from(files).every((file) => file?.size <= MAX_FILE_SIZE),
        "Max image size is 10MB"
      )
      .optional()
  ),
});

export const createMessage = (chatId: string) => async (data: TCreateMessage) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      return value.forEach((v) => formData.append(key, v));
    }
    if (typeof value === "object") {
      return formData.append(key, JSON.stringify(value));
    }

    if (typeof value === "string") {
      return formData.append(key, value);
    }
  });

  const { error, data: res } = await tryCatch(
    ApiClient.callApi(`chats/${chatId}/messages`, {
      authenticatedRequest: true,
      method: "POST",
      body: formData,
    })
  );

  if (error) throw error;

  return res.json();
};

export const useCreateMessage = (chatId: string, options: UseCreateMessageOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restOption } = options;

  return useMutation({
    ...restOption,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getInfiniteMessagesQueryOptions(chatId).queryKey });
      onSuccess?.(...args);
    },
    mutationFn: createMessage(chatId),
  });
};
