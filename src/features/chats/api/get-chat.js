import z from "zod";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { ApiClient, generateHeader, queryConfig, tryCatch, errorHandler } from "../../../lib";

export const chatResponseSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().uuid().optional(),
  name: z.string().nullable(),
  type: z.enum(["GroupChat", "DirectChat"]),
  isPrivate: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
  avatar: z
    .object({
      url: z.string(),
      images: z
        .array(
          z.object({
            url: z.string(),
            size: z.number(),
            format: z.string(),
          })
        )
        .optional(),
    })
    .nullable(),
});

export const getChat = async (chatId) => {
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

  const parsedData = chatResponseSchema.safeParse(resData);

  if (!parsedData.success) {
    errorHandler(res, {
      code: 422,
      data: resData,
      message: `Validation failed: ${parsedData.error.issues.length} errors detected in body`,
      ...parsedData.error,
    });
  }

  return parsedData.data;
};

export const getChatQueryOptions = (chatId) =>
  queryOptions({
    ...queryConfig,
    queryKey: ["chats", chatId],
    queryFn: () => getChat(chatId),
  });

export const useChat = (chatId, options) =>
  useQuery({
    ...queryConfig,
    ...options,
    ...getChatQueryOptions(chatId),
  });
