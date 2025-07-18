import z from "zod";

const MAX_ATTACHMENTS_LENGTH = 5;
export const MAX_CONTENT_LENGTH = 2000;

export const MAX_FILE_SIZE = 10_000_000; // 10mb

export const ACCEPTED_ATTACHMENTS_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/epub+zip",
  "application/pdf",
];

export const createMessageSchema = z.object({
  content: z.string().trim().max(MAX_CONTENT_LENGTH),
  attachments: z
    .array(z.instanceof(File))
    .max(MAX_ATTACHMENTS_LENGTH, {
      message: `You can only upload ${MAX_ATTACHMENTS_LENGTH} files at a time!`,
    })
    .refine(
      (files) => Array.from(files).every((file) => ACCEPTED_ATTACHMENTS_TYPES.includes(file.type)),
      "Only .jpg, .jpeg, .png, .webp, epub and pdf formats are supported."
    )
    .refine(
      (files) => Array.from(files).every((file) => file?.size <= MAX_FILE_SIZE),
      "Max image size is 10MB"
    )

    .optional(),
});
