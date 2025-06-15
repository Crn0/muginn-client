import z from "zod";

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
});
