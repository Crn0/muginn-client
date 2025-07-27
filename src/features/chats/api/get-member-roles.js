import { queryOptions, useQuery } from "@tanstack/react-query";

import { ApiClient, errorHandler, tryCatch } from "../../../lib";
import { rolesSchema } from "./get-my-roles";

export const getMemberRoles = async (chatId, memberId) => {
  const { error, data: res } = await tryCatch(
    ApiClient.callApi(`chats/${chatId}/members/${memberId}/roles`, {
      authenticatedRequest: true,
      method: "GET",
    })
  );

  if (error) throw error;

  const resData = await res.clone().json();
  const parsedData = rolesSchema.safeParse(resData);

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

export const getMemberRolesQueryOptions = (chatId, memberId) =>
  queryOptions({
    queryKey: ["chats", "members", "roles", chatId, memberId],
    queryFn: () => getMemberRoles(chatId, memberId),
  });

export const useMemberRoles = (chatId, memberId, options) =>
  useQuery({
    ...options,
    ...getMemberRolesQueryOptions(chatId, memberId),
  });
