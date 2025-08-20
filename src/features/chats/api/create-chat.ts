import z from "zod";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { ApiClient, tryCatch } from "@/lib";
import { getChatsQueryOptions } from "./get-chats";
import type { ValidationError } from "@/errors";

export interface CreateChatResponse {
  id: string;
}

export interface ICreateGroupChat extends z.infer<typeof groupChatSchema> {
  type: "GroupChat";
  isMultiForm?: boolean;
}
export interface ICreateDirectChat extends z.infer<typeof directChatSchema> {}

export type TCreateChat = ICreateGroupChat | ICreateDirectChat;

export type UseCreateChatOptions = UseMutationOptions<
  CreateChatResponse,
  ValidationError,
  TCreateChat
>;

export const NAME_LEN = 100;

export const MAX_FILE_SIZE = 10_000_000; // 10mb
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const chatType = z.enum(["DirectChat", "GroupChat"]);

export const groupChatSchema = z.object({
  intent: z.string().default("create:chat:group"),
  type: chatType.default("GroupChat"),
  name: z.string().max(NAME_LEN).optional(),
  avatar: z
    .any()
    .refine(
      (file) => (file.length === 1 ? !!ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type) : true),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .refine(
      (file) => (file.length === 1 ? file[0]?.size <= MAX_FILE_SIZE : true),
      "Max image size is 10MB"
    )
    .optional(),
});

export const directChatSchema = z.object({
  intent: z.string().default("create:chat:direct"),
  type: chatType.default("GroupChat"),
  memberIds: z.array(z.string().uuid()).min(2).max(2).optional(),
});

const isCreateGroupChat = (data: any): data is ICreateGroupChat => {
  return (data as ICreateGroupChat).type === "GroupChat";
};

export const createChat = async (data: TCreateChat): Promise<CreateChatResponse> => {
  if (isCreateGroupChat(data)) {
    if (data.isMultiForm) {
      delete data.avatar;
    }

    delete data.isMultiForm;
  }

  const { intent, ...rest } = data;

  const formData = new FormData();

  Object.entries(rest).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("chats", {
      authenticatedRequest: true,
      method: "POST",
      body: formData,
    })
  );

  if (error) throw error;

  return res.json();
};

export const useCreateChat = (options?: UseCreateChatOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restOption } = options || {};

  return useMutation({
    ...restOption,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getChatsQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    mutationFn: createChat,
  });
};
