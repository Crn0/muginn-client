import z from "zod";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { CustomError, ValidationError } from "@/errors";
import { queryConfig } from "@/lib/react-query";
import { ApiClient } from "@/lib/api-client";
import { tryCatch } from "@/lib/try-catch";
import { errorHandler } from "@/lib/errors/error-handler";

export type TAuthUser = z.infer<typeof authUserSchema>;
export type TUserAvatar = z.infer<typeof avatarSchema>;

export const authProviders = z.enum(["google"]);

export const avatarSchema = z.object({
  url: z.string(),
  type: z.literal("Image"),
  images: z.array(
    z.object({
      url: z.string(),
      format: z.string(),
      type: z.literal("Image"),
      size: z.number(),
    })
  ),
});

export const authUserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().nullable(),
  accountLevel: z.number(),
  status: z.enum(["Online", "Offline", "Invisible"]),
  joinedAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
  lastSeenAt: z.string().datetime().nullable(),
  openIds: z.array(z.object({ provider: authProviders })),
  profile: z.object({
    displayName: z.string().nullable(),
    aboutMe: z.string().nullable(),
    avatar: avatarSchema.nullable(),
    backgroundAvatar: avatarSchema.nullable(),
  }),
});

export const getUser = async () => {
  const { error, data: res } = await tryCatch(
    ApiClient.callApi("users/me", {
      authenticatedRequest: true,
      method: "GET",
    })
  );

  if (error) {
    throw errorHandler(error);
  }

  const data = await res.clone().json();

  const parsedUser = authUserSchema.safeParse(data);

  if (!parsedUser.success) {
    const parsedError = parsedUser.error;

    const message = `Validation failed: ${parsedError.issues.length} errors detected in user data`;
    const zodError = new ValidationError({ message, fields: parsedError.issues });

    throw errorHandler(zodError);
  }

  return parsedUser.data;
};

export const getAuthUserQueryOptions = () =>
  queryOptions<TAuthUser, CustomError>({
    ...queryConfig,
    queryKey: ["authenticated-user"],
    queryFn: getUser,
  });

export const useGetUser = ({ enabled = true }: { enabled?: boolean } = {}) => {
  return useQuery({
    ...getAuthUserQueryOptions(),
    enabled,
  });
};
