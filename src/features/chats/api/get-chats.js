import z from "zod";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { ApiClient, generateHeader, queryConfig, tryCatch } from "../../../lib";
import formatApiError from "../../../lib/format-api-error";

const chatSchema = z.object({
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

export const chatResponseSchema = z.array(chatSchema);

export const getChats = async () => {
  const headers = generateHeader();

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("chats", {
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

export const getChatsQueryOptions = (options) =>
  queryOptions({
    ...queryConfig,
    ...options,
    queryKey: ["chats"],
    queryFn: getChats,
  });

export const useChats = (options) =>
  useQuery({
    ...queryConfig,
    ...options,
    ...getChatsQueryOptions(),
  });
