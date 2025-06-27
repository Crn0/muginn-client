import z from "zod";

export const chatId = z.string().uuid();

export const leaveChatSchema = z.object({
  chatId,
  intent: z.string().default("delete:chat:group"),
});
