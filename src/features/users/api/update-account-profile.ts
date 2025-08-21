import z from "zod";
import {
  QueryClient,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import type { ValidationError } from "@/errors";
import { ApiClient, generateHeader, getAuthUserQueryOptions, tryCatch } from "@/lib";
import { resetStore } from "@/stores";

export type TUpdateUsername = z.infer<typeof usernameSchema>;
export type TUpdatePassword = z.infer<typeof passwordSchema>;

export type TUpdateAccountProfile = TUpdateUsername | TUpdatePassword;
export type UseUpdateAccountProfileOptions = UseMutationOptions<
  void,
  ValidationError,
  TUpdateAccountProfile
>;

// https://regexr.com/8dmei
const usernameRegex = /^[a-zA-Z0-9{_,.}]+$/;
// https://regexr.com/8dm04
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const password = z.string().refine((val) => passwordRegex.test(val), {
  message:
    "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number and no spaces",
});

export const usernameSchema = z.object({
  intent: z.literal("update:accountProfile:username").default("update:accountProfile:username"),
  username: z
    .string()
    .min(4)
    .max(36)
    .refine((val) => usernameRegex.test(val), {
      message:
        "Username can only contain letters (A-Z, a-z), numbers (0-9), and the characters: _ , .",
    }),
});

export const passwordSchema = z
  .object({
    intent: z.literal("update:accountProfile:password").default("update:accountProfile:password"),
    oldPassword: password,
    currentPassword: password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.currentPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateUsername = async (data: TUpdateUsername) => {
  const headers = generateHeader(["Content-Type", "application/json"]);

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("users/me/username", {
      headers,
      authenticatedRequest: true,
      method: "PATCH",
      body: JSON.stringify(data),
    })
  );

  if (error) throw error;

  return res.json();
};

export const updatePassword = async (data: TUpdatePassword) => {
  const headers = generateHeader(["Content-Type", "application/json"]);

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("users/me/password", {
      headers,
      authenticatedRequest: true,
      method: "PATCH",
      body: JSON.stringify(data),
      credentials: "include",
    })
  );

  if (error) throw error;

  return res;
};

const updateAccountProfile = (queryClient: QueryClient) => async (data: TUpdateAccountProfile) => {
  const intent = data?.intent;

  if (intent === "update:accountProfile:username") {
    const { error } = await tryCatch(updateUsername(data));

    if (error) throw error;

    queryClient.invalidateQueries({
      queryKey: getAuthUserQueryOptions().queryKey,
    });

    return;
  }

  if (intent === "update:accountProfile:password") {
    const { error } = await tryCatch(updatePassword(data));

    if (error) throw error;

    queryClient.clear();

    resetStore();

    return;
  }

  throw new Error("Invalid intent");
};

export const useUpdateAccountProfile = (options?: UseUpdateAccountProfileOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restConfig } = options || {};

  return useMutation({
    ...restConfig,
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    onError: (...args) => {
      onError?.(...args);
    },
    mutationFn: updateAccountProfile(queryClient),
  });
};
