import z from "zod";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { CustomError, ValidationError } from "@/errors";
import { ApiClient, generateHeader, queryConfig, tryCatch, errorHandler } from "@/lib";

export type TChat = z.infer<typeof chatSchema>;
export type TGroupChat = TChat & { name: string; type: "GroupChat" };
export type TDirectChat = TChat & { type: "DirectChat" };
export type TChatAvatar = z.infer<typeof chatAvatarSchema>;

export const chatAvatarSchema = z.object({
  url: z.string(),
  images: z.array(
    z.object({
      url: z.string(),
      format: z.string(),
      size: z.number(),
    })
  ),
});

export const chatSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().uuid().nullable(),
  name: z.string().nullable(),
  type: z.enum(["GroupChat", "DirectChat"]),
  isPrivate: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
  avatar: chatAvatarSchema.nullable(),
});

export const getChat = async (chatId: string) => {
  const headers = generateHeader();

  const { error, data: res } = await tryCatch(
    ApiClient.callApi(`chats/${chatId}`, {
      headers,
      authenticatedRequest: true,
      method: "GET",
    })
  );

  if (error) throw error;

  const resData = await res.clone().json();

  const parsedData = chatSchema.safeParse(resData);

  if (!parsedData.success) {
    const parsedError = parsedData.error;

    const message = `Validation failed: ${parsedError.issues.length} errors detected in user data`;
    const zodError = new ValidationError({ message, fields: parsedError.issues });

    throw errorHandler(zodError);
  }

  return parsedData.data;
};

export const getChatQueryOptions = (chatId: string) =>
  queryOptions<TChat, CustomError>({
    ...queryConfig,
    queryKey: ["chats", chatId],
    queryFn: () => getChat(chatId),
  });

export const useChat = (chatId: string) =>
  useQuery({
    ...getChatQueryOptions(chatId),
  });

export const isGroupChat = (chat?: TChat): chat is TGroupChat => {
  return (chat as TGroupChat)?.type === "GroupChat";
};

export const isDirectChat = (chat?: TChat): chat is TDirectChat => {
  return (chat as TDirectChat)?.type === "DirectChat";
};
