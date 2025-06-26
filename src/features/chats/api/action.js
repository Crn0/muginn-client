import { createChat } from "./create-chat";

export default async function clientAction({ request }) {
  const formData = await request.clone().formData();

  const intent = formData.get("intent");

  if (intent.includes("create:chat")) return createChat(request);

  throw new Error("Invalid intent");
}
