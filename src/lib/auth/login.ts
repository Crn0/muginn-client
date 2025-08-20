import z from "zod";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import type { ValidationError } from "@/errors";

import { passwordRegex, usernameRegex } from "./regex";

import { getAuthUserQueryOptions } from "./get-user";
import { generateHeader } from "@/lib/api/generate-header";
import { ApiClient } from "@/lib/api-client";
import { tryCatch } from "@/lib";

export interface LoginResponse {
  token: string;
}

export type TLogin = z.infer<typeof loginSchema>;

export type UseLoginOptions = UseMutationOptions<LoginResponse, ValidationError, TLogin>;

export const loginSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Username must contain at least 4 character(s)" })
    .max(36, { message: "Username must contain at most 36 character(s)" })
    .refine((val) => usernameRegex.test(val), {
      message:
        "Username can only contain letters (A-Z, a-z), numbers (0-9), and the characters: _ , .",
    }),
  password: z.string().refine((val) => passwordRegex.test(val), {
    message:
      "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number and no spaces",
  }),
});

export const login = async ({ username, password }: TLogin): Promise<LoginResponse> => {
  const headers = generateHeader(["Content-Type", "application/json"]);

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("auth/login", {
      headers,
      authenticatedRequest: false,
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ username, password }),
    })
  );

  if (error) {
    throw error;
  }

  return res.json();
};

export const useLogin = (options: UseLoginOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...rest } = options;

  const mutation = useMutation({
    ...rest,
    mutationFn: login,
    onSuccess: (...args) => {
      queryClient.removeQueries({ queryKey: getAuthUserQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    onError: (...args) => {
      onError?.(...args);
    },
  });

  return mutation;
};
