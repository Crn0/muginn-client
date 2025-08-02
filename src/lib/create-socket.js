import { io } from "socket.io-client";

import { env } from "../configs";

export default function createSocket(namespace, options = {}) {
  const serverUrl = env.getValue("serverUrl").replace(/\/$/, "");
  const formattedNamespace = namespace.startsWith("/") ? namespace : `/${namespace}`;

  return io(`${serverUrl}${formattedNamespace}`, {
    autoConnect: false,
    ...options,
  });
}
