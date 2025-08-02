import z from "zod";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

import { ApiClient, tryCatch, errorHandler } from "../../../lib";

const messageSchema = z.object({
  id: z.string().uuid(),
  chatId: z.string().uuid(),
  content: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
  deletedAt: z.string().datetime().nullable(),
  user: z.object({
    id: z.string().uuid(),
    username: z.string(),
    profile: z.object({
      displayName: z.string().nullable(),
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
    }),
  }),
  replies: z.array(z.string().uuid()),
  replyTo: z
    .object({
      id: z.string().uuid(),
    })
    .nullable(),
  attachments: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      type: z.enum(["Image", "Epub", "Pdf"]),
      images: z
        .array(
          z.object({
            url: z.string(),
            size: z.number(),
            format: z.string(),
          })
        )
        .nullable(),
    })
  ),
});

const paginationSchema = z.object({
  prevHref: z.string().nullable(),
  nextHref: z.string().nullable(),
});

export const messagesResponseSchema = z.object({
  messages: z.array(messageSchema),
  pagination: paginationSchema,
});

export const getMessages = async (chatId, cursor) => {
  const resource = !cursor ? `chats/${chatId}/messages` : `chats/${chatId}${cursor}`;

  const { error, data: res } = await tryCatch(
    ApiClient.callApi(resource, {
      authenticatedRequest: true,
      method: "GET",
    })
  );

  if (error) throw error;

  const resData = await res.clone().json();

  const parsedData = messagesResponseSchema.safeParse(resData);

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

export const getInfiniteMessagesQueryOptions = (chatId) =>
  infiniteQueryOptions({
    initialPageParam: null,
    queryKey: ["chats", chatId, "messages"],
    queryFn: ({ pageParam: cursorHref }) => getMessages(chatId, cursorHref),
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
    getNextPageParam: ({ pagination }) => pagination.nextHref,
    getPreviousPageParam: ({ pagination }) => pagination.prevHref,
  });

export const useInfiniteMessages = (chatId) =>
  useInfiniteQuery({ ...getInfiniteMessagesQueryOptions(chatId) });
