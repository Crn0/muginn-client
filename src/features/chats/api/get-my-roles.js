import { z } from "zod";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { ApiClient, errorHandler, flatPermissions, tryCatch } from "../../../lib";

export const rolesSchema = z.array(
  z.object({
    name: z.string(),
    roleLevel: z.number().nullable(),
    permissions: z.array(z.object({ name: z.enum(flatPermissions) })),
  })
);

export const getMyRoles = async (chatId) => {
  const { error, data: res } = await tryCatch(
    ApiClient.callApi(`chats/${chatId}/roles/me`, {
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

export const getMyRolesQueryOptions = (chatId) =>
  queryOptions({
    queryKey: ["chats", "roles", "me", chatId],
    queryFn: () => getMyRoles(chatId),
  });

export const useMyRoles = (chatId, options) =>
  useQuery({
    ...options,
    ...getMyRolesQueryOptions(chatId),
  });
