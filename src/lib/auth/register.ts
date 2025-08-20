import z from "zod";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import type { ValidationError } from "@/errors";

import { passwordRegex, usernameRegex } from "./regex";

import { generateHeader } from "@/lib/api/generate-header";
import { ApiClient } from "@/lib/api-client";
import { tryCatch } from "@/lib/try-catch";
import { errorHandler } from "@/lib/errors/error-handler";

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .max(36, { message: "Display name must contain at most 36 character(s)" }),
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
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TRegister = z.infer<typeof registerSchema>;

export type TUseRegisterOptions = UseMutationOptions<Response, ValidationError, TRegister>;

export const register = async (data: TRegister) => {
  const headers = generateHeader(["Content-Type", "application/json"]);

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("auth/register", {
      headers,
      authenticatedRequest: false,
      method: "POST",
      body: JSON.stringify(data),
    })
  );

  if (error) {
    throw errorHandler(error);
  }

  return res;
};

export const useRegister = (options: TUseRegisterOptions) => {
  const { onSuccess, onError, ...rest } = options;

  return useMutation({
    ...rest,
    mutationFn: register,
    onSuccess: (...args) => options?.onSuccess?.(...args),
    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
};
