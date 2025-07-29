import z from "zod";

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "./create-chat";

export const MAX_NAME_LEN = 36;

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

export const chatProfileSchema = z.object({
  name: z
    .string({ message: `Name must contain at most ${MAX_NAME_LEN} character(s)` })
    .trim()
    .max(MAX_NAME_LEN)
    .optional(),
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
});
