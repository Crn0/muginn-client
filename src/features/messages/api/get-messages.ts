import z from "zod";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

import { CustomError, ValidationError } from "@/errors";
import { ApiClient, tryCatch, errorHandler } from "@/lib";

export type TMessage = z.infer<typeof messageSchema>;
export type TMessageList = TMessage[];
export type MessagePagination = z.infer<typeof paginationSchema>;

export type MessageResponse = {
  messages: TMessageList;
  pagination: MessagePagination;
};

export const messageSchema = z.object({
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
          type: z.enum(["Image", "Epub", "Pdf"]),
          images: z.array(
            z.object({
              url: z.string(),
              size: z.number(),
              format: z.string(),
            })
          ),
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
      images: z.array(
        z.object({
          url: z.string(),
          size: z.number(),
          format: z.string(),
        })
      ),
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

export const getMessages = async (chatId: string, pageParam: string | null) => {
  const resource = !pageParam ? `chats/${chatId}/messages` : `chats/${chatId}${pageParam}`;

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
    const parsedError = parsedData.error;

    const message = `Validation failed: ${parsedError.issues.length} errors detected in user data`;
    const zodError = new ValidationError({ message, fields: parsedError.issues });

    throw errorHandler(zodError);
  }

  return parsedData.data;
};

export const getInfiniteMessagesQueryOptions = (chatId: string) =>
  infiniteQueryOptions<MessageResponse, CustomError>({
    initialPageParam: null,
    queryKey: ["chats", chatId, "messages"],
    queryFn: ({ pageParam }) => getMessages(chatId, pageParam as string | null),
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
    getNextPageParam: ({ pagination }) => pagination.nextHref,
    getPreviousPageParam: ({ pagination }) => pagination.prevHref,
  });

export const useInfiniteMessages = (chatId: string) =>
  useInfiniteQuery({ ...getInfiniteMessagesQueryOptions(chatId) });
