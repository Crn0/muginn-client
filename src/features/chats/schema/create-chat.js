import z from "zod";

const CHAT_TYPE = ["DirectChat", "GroupChat"];
export const NAME_LEN = 100;

export const MAX_FILE_SIZE = 10_000_000; // 10mb
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const chatType = z.enum(CHAT_TYPE);

export const groupChatSchema = z.object({
  intent: z.string().default("create:chat:group"),
  type: chatType.default("GroupChat"),
  name: z.string().max(NAME_LEN),
  avatar: z
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

export const directChatSchema = z.object({
  intent: z.string().default("create:chat:direct"),
  type: chatType.default("GroupChat"),
  memberIds: z.array(z.string().uuid()).min(2).max(2),
});
