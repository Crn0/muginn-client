import z from "zod";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { ApiClient, generateHeader, queryConfig, tryCatch } from "../../../lib";
import formatApiError from "../../../lib/format-api-error";

export const chatResponseSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().uuid().optional(),
  name: z.string().nullable(),
  type: z.enum(["GroupChat", "DirectChat"]),
  isPrivate: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
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
    const e = formatApiError(res, {
      data: resData,
      ...parsedData.error,
    });

    throw e;
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
