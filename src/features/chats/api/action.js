import { tryCatch } from "../../../lib";
import { createChat } from "./create-chat";

export default function clientAction(queryClient) {
  return async ({ request }) => {
    const formData = await request.clone().formData();

    const intent = formData.get("intent");

    if (intent.includes("create:chat")) return tryCatch(createChat(queryClient)(request));

    throw new Error("Invalid intent");
  };
}
