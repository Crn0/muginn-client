import { createSocket } from "../../../lib";
import { getToken } from "../../../stores";
import { CHAT_NAMESPACE } from "./events";

export const chatSocket = createSocket(CHAT_NAMESPACE, {
  auth: (cb) =>
    cb({
      accessToken: getToken(),
    }),
});
