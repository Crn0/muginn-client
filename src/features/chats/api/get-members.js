import { z } from "zod";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { ApiClient, errorHandler, tryCatch } from "../../../lib";
import { memberSchema } from "./get-member";

const paginationSchema = z.object({
  prevHref: z.string().nullable(),
  nextHref: z.string().nullable(),
});

export const membersResponseSchema = z.object({
  members: z.array(memberSchema),
  pagination: paginationSchema,
  memberCount: z.number(),
});

export const transformMembers = (members) =>
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

export const getMembers = async (chatId, cursor) => {
  const resource = !cursor ? `chats/${chatId}/members` : `chats/${chatId}${cursor}`;

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
    errorHandler(res, {
      code: 422,
      data: resData,
      message: `Validation failed: ${parsedData.error.issues.length} errors detected in body`,
      ...parsedData.error,
    });
  }

  return parsedData.data;
};

export const getInfiniteMembersQueryOptions = (chatId) =>
  infiniteQueryOptions({
    initialPageParam: null,
    queryKey: ["chats", "members", chatId],
    queryFn: ({ pageParam: cursorHref }) => getMembers(chatId, cursorHref),
    getNextPageParam: ({ pagination }) => pagination.nextHref,
    getPreviousPageParam: ({ pagination }) => pagination.prevHref,
  });

export const useInfiniteChatMembers = (chatId, options) =>
  useInfiniteQuery({
    ...options,
    ...getInfiniteMembersQueryOptions(chatId),
    select: useCallback(
      (data) => ({
        ...data,
        pages: data.pages.map((page) => ({ ...page, members: transformMembers(page.members) })),
      }),
      []
    ),
  });
