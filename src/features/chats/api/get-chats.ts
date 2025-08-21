import z from "zod";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { CustomError, ValidationError } from "@/errors";
import { ApiClient, generateHeader, queryConfig, tryCatch, errorHandler } from "@/lib";
import { chatSchema } from "./get-chat";

export type TChatList = z.infer<typeof chatsSchema>;

export const chatsSchema = z.array(chatSchema);

export const getChats = async () => {
  const headers = generateHeader();

  const { error, data: res } = await tryCatch(
    ApiClient.callApi("chats", {
      headers,
      authenticatedRequest: true,
      method: "GET",
    })
  );

  if (error) throw error;

  const resData = await res.clone().json();

  const parsedData = chatsSchema.safeParse(resData);

  if (!parsedData.success) {
    const parsedError = parsedData.error;

    const message = `Validation failed: ${parsedError.issues.length} errors detected in chats data`;
    const zodError = new ValidationError({ message, fields: parsedError.issues });

    throw errorHandler(zodError);
  }
  return parsedData.data;
};

export const getChatsQueryOptions = () =>
  queryOptions<TChatList, CustomError>({
    ...queryConfig,
    queryKey: ["chats"],
    queryFn: getChats,
  });

export const useChats = () =>
  useQuery({
    ...queryConfig,
    ...getChatsQueryOptions(),
  });
