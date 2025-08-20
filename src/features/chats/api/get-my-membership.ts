import { queryOptions, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { ApiClient, errorHandler, tryCatch } from "@/lib";
import { memberSchema, type TChatMember } from "./get-member";

import { getMyRoles, type TChatRoles } from "./get-my-roles";
import { ValidationError } from "@/errors";

export const getChatMembership = async (id: string) => {
  const { error, data: res } = await tryCatch(
    ApiClient.callApi(`chats/${id}/members/me`, {
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

export const getMyMembershipQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["chats", "membership", id],
    queryFn: async () => {
      const member = await getChatMembership(id);
      const roles = await getMyRoles(id);

      return { member, roles };
    },
  });

export const useMyMembership = (id: string) =>
  useQuery({
    ...getMyMembershipQueryOptions(id),
    select: useCallback(
      ({ member, roles }: { member: TChatMember; roles: TChatRoles }) => ({
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
