import { createSocket } from "../../../lib";
import { CHAT_NAMESPACE } from "./events";

export const chatSocket = createSocket(CHAT_NAMESPACE);
