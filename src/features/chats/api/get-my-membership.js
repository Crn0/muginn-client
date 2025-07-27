import { queryOptions, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { ApiClient, errorHandler, tryCatch } from "../../../lib";
import { memberSchema } from "./get-member";
import { getMyRoles } from "./get-my-roles";

export const getChatMembership = async (chatId) => {
  const { error, data: res } = await tryCatch(
    ApiClient.callApi(`chats/${chatId}/members/me`, {
      authenticatedRequest: true,
      method: "GET",
    })
  );

  if (error) throw error;

  const resData = await res.clone().json();
  const parsedData = memberSchema.safeParse(resData);

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

export const getMyMembershipQueryOptions = (chatId, options) =>
  queryOptions({
    ...options,
    queryKey: ["chats", "membership", chatId],
    queryFn: async () => {
      const member = await getChatMembership(chatId);
      const roles = await getMyRoles(chatId);

      return { member, roles };
    },
  });

export const useMyMembership = (chatId, options) =>
  useQuery({
    ...options,
    ...getMyMembershipQueryOptions(chatId, options),
    select: useCallback(
      ({ member, roles }) => ({
        roles,
        id: member.id,
        username: member.username,
        accountLevel: member.accountLevel,
        status: member.status,
        createdAt: member.createdAt,
        lastSeenAt: member.lastSeenAt,
        profile: {
          ...member.profile,
          joinedAt: member.serverProfile.joinedAt,
          mutedUntil: member.serverProfile.mutedUntil,
        },
      }),
      []
    ),
  });
