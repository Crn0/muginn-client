import z from "zod";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";

import { ApiClient, getAuthUserQueryOptions, tryCatch } from "@/lib";
import type { ValidationError } from "@/errors";

export type TUpdateMainProfile = z.infer<typeof userMainProfileSchema>;
export type UseUpdateMainProfileOptions = UseMutationOptions<
  { id: string },
  ValidationError,
  TUpdateMainProfile
>;

export const MAX_DISPLAY_NAME_LEN = 36;
export const MAX_ABOUT_ME_LEN = 200;
export const MAX_FILE_SIZE = 10_000_000; // 10mb
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const PostUploadFileSchema = z.object({
  images: z
    .any()
    .refine(
      (file) => (file.length === 1 ? !!ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type) : true),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .refine(
      (file) => (file.length === 1 ? file[0]?.size <= MAX_FILE_SIZE : true),
      "Max image size is 10MB"
    )
    .optional(),
});

export const userMainProfileSchema = z.object({
  intent: z.string().default("update:mainProfile"),
  displayName: z.string().trim().max(MAX_DISPLAY_NAME_LEN).optional(),
  aboutMe: z.string().trim().max(MAX_ABOUT_ME_LEN).optional(),
  avatar: z
    .instanceof(FileList)
    .refine((file) => file.length <= 1, "Upload only one image at a time")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .refine(
      (file) => (file.length === 1 ? file[0]?.size <= MAX_FILE_SIZE : true),
      "Max image size is 10MB"
    )
    .optional(),
  backgroundAvatar: z
    .instanceof(FileList)
    .refine((file) => file.length <= 1, "Upload only one image at a time")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .refine(
      (file) => (file.length === 1 ? file[0]?.size <= MAX_FILE_SIZE : true),
      "Max image size is 10MB"
    )
    .optional(),
  avatarId: z.string().optional(),
});

export const deleteBackgroundAvatar = async () => {
  const { error } = await tryCatch(
    ApiClient.callApi("users/me/profile/background-avatar", {
      authenticatedRequest: true,
      method: "DELETE",
    })
  );

  if (error) throw error;
};

export const deleteAvatar = async () => {
  const { error } = await tryCatch(
    ApiClient.callApi("users/me/profile/avatar", {
      authenticatedRequest: true,
      method: "DELETE",
    })
  );

  if (error) throw error;
};

export const updateProfile = async (data: TUpdateMainProfile) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (["avatar", "backgroundAvatar"].includes(key)) {
      formData.append(key, value[0]);
    }

    if (typeof value === "string") {
      formData.append(key, value);
    }
  });

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("users/me/profile", {
      authenticatedRequest: true,
      method: "PATCH",
      body: formData,
    })
  );

  if (error) throw error;

  return res.json();
};

export const updateMainProfile = async (data: TUpdateMainProfile) => {
  const { intent } = data;

  if (intent === "update:mainProfile") return updateProfile(data);

  if (intent === "delete:backgroundAvatar") return deleteBackgroundAvatar();

  if (intent === "delete:avatar") return deleteAvatar();

  throw Error(`invalid ${intent}`);
};

export const useUpdateMainProfile = (options?: UseUpdateMainProfileOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...restConfig } = options || {};

  return useMutation({
    ...restConfig,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getAuthUserQueryOptions().queryKey });

      onSuccess?.(...args);
    },
    onError: (...args) => {
      onError?.(...args);
    },
    mutationFn: (data) => updateMainProfile(data),
  });
};
