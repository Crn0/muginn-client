import { queryOptions, useQuery } from "@tanstack/react-query";

import { ValidationError } from "@/errors";
import { ApiClient, errorHandler, tryCatch } from "@/lib";
import { rolesSchema } from "./get-my-roles";

export const getMemberRoles = async (chatId: string, memberId: string) => {
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
    const parsedError = parsedData.error;

    const message = `Validation failed: ${parsedError.issues.length} errors detected in user data`;
    const zodError = new ValidationError({ message, fields: parsedError.issues });

    throw errorHandler(zodError);
  }

  return parsedData.data;
};

export const getMemberRolesQueryOptions = (chatId: string, memberId: string) =>
  queryOptions({
    queryKey: ["chats", "members", "roles", chatId, memberId],
    queryFn: () => getMemberRoles(chatId, memberId),
  });

export const useMemberRoles = (chatId: string, memberId: string) =>
  useQuery({
    ...getMemberRolesQueryOptions(chatId, memberId),
  });
