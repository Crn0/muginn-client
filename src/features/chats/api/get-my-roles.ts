import { z } from "zod";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { ApiClient, errorHandler, flatPermissions, tryCatch } from "@/lib";
import { ValidationError } from "@/errors";

export type TChatRoles = z.infer<typeof rolesSchema>;

export const rolesSchema = z.array(
  z.object({
    name: z.string(),
    roleLevel: z.number().nullable(),
    permissions: z.array(z.object({ name: z.enum(flatPermissions) })),
  })
);

export const getMyRoles = async (chatId: string) => {
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
    const parsedError = parsedData.error;

    const message = `Validation failed: ${parsedError.issues.length} errors detected in user data`;
    const zodError = new ValidationError({ message, fields: parsedError.issues });

    throw errorHandler(zodError);
  }

  return parsedData.data;
};

export const getMyRolesQueryOptions = (chatId: string) =>
  queryOptions({
    queryKey: ["chats", "roles", "me", chatId],
    queryFn: () => getMyRoles(chatId),
  });

export const useMyRoles = (chatId: string) =>
  useQuery({
    ...getMyRolesQueryOptions(chatId),
  });
