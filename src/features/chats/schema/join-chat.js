import z from "zod";

// eslint-disable-next-line import/prefer-default-export
export const joinChatChatSchema = z.object({
  chatId: z.string().uuid({ message: "Invalid invite" }),
});
