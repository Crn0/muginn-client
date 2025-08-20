import z from "zod";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { ValidationError } from "@/errors";
import { ApiClient, errorHandler, tryCatch } from "@/lib";

export type TChatMember = z.infer<typeof memberSchema>;

export const memberSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  accountLevel: z.number(),
  status: z.enum(["Online", "Offline", "Invisible"]),
  createdAt: z.coerce.date(),
  lastSeenAt: z.string().datetime().nullable(),
  profile: z.object({
    displayName: z.string().nullable(),
    avatar: z
      .object({
        url: z.string(),
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
  serverProfile: z.object({
    joinedAt: z.coerce.date(),
    mutedUntil: z.string().datetime().nullable(),
    roles: z.array(z.object({ id: z.string().uuid() })),
  }),
});

export const getMember = async (chatId: string, memberId: string) => {
  const { error, data: res } = await tryCatch(
    ApiClient.callApi(`chats/${chatId}/members/${memberId}`, {
      authenticatedRequest: true,
      method: "GET",
    })
  );

  if (error) throw error;

  const resData = await res.clone().json();
  const parsedData = memberSchema.safeParse(resData);

  if (!parsedData.success) {
    const parsedError = parsedData.error;

    const message = `Validation failed: ${parsedError.issues.length} errors detected in user data`;
    const zodError = new ValidationError({ message, fields: parsedError.issues });

    throw errorHandler(zodError);
  }

  return parsedData.data;
};

export const getChatMemberQueryOptions = (chatId: string, memberId: string) =>
  queryOptions({
    queryKey: ["chats", "members", chatId, memberId],
    queryFn: () => getMember(chatId, memberId),
  });

export const useChatMember = (chatId: string, memberId: string) =>
  useQuery({
    ...getChatMemberQueryOptions(chatId, memberId),
  });
