import { z } from "zod";
import { infiniteQueryOptions, useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { useCallback } from "react";

import { ApiClient, errorHandler, tryCatch } from "@/lib";
import { memberSchema, type TChatMember } from "./get-member";
import { ValidationError } from "@/errors";

export type TChatMemberList = TChatMember[];
export type TChatMemberPagination = z.infer<typeof paginationSchema>;

type DataProps = InfiniteData<{
  members: TChatMemberList;
  pagination: TChatMemberPagination;
  memberCount: number;
}>;

const paginationSchema = z.object({
  prevHref: z.string().nullable(),
  nextHref: z.string().nullable(),
});

export const membersResponseSchema = z.object({
  members: z.array(memberSchema),
  pagination: paginationSchema,
  memberCount: z.number(),
});

export const transformMembers = (members: TChatMemberList) =>
  members.map((member) => ({
    id: member.id,
    username: member.username,
    accountLevel: member.accountLevel,
    status: member.status,
    createdAt: member.createdAt,
    lastSeenAt: member.lastSeenAt,
    roles: member.serverProfile.roles,
    profile: {
      ...member.profile,
      joinedAt: member.serverProfile.joinedAt,
      mutedUntil: member.serverProfile.mutedUntil,
    },
  }));

export const getMembers =
  (chatId: string) =>
  async ({ pageParam }: { pageParam: string | null }) => {
    const resource = !pageParam ? `chats/${chatId}/members` : `chats/${chatId}${pageParam}`;

    const { error, data: res } = await tryCatch(
      ApiClient.callApi(resource, {
        authenticatedRequest: true,
        method: "GET",
      })
    );

    if (error) throw error;

    const resData = await res.clone().json();
    const parsedData = membersResponseSchema.safeParse(resData);

    if (!parsedData.success) {
      const parsedError = parsedData.error;

      const message = `Validation failed: ${parsedError.issues.length} errors detected in user data`;
      const zodError = new ValidationError({ message, fields: parsedError.issues });

      throw errorHandler(zodError);
    }

    return parsedData.data;
  };

export const getInfiniteMembersQueryOptions = (chatId: string) =>
  infiniteQueryOptions({
    initialPageParam: null,
    queryKey: ["chats", "members", chatId],
    queryFn: getMembers(chatId),
    getNextPageParam: ({ pagination }) => pagination.nextHref,
    getPreviousPageParam: ({ pagination }) => pagination.prevHref,
  });

export const useInfiniteChatMembers = (chatId: string) =>
  useInfiniteQuery({
    ...getInfiniteMembersQueryOptions(chatId),
    select: useCallback(
      (data: DataProps) => ({
        ...data,
        pages: data.pages.map((page) => ({ ...page, members: transformMembers(page.members) })),
      }),
      []
    ),
  });
