import { userPolicy } from "./user-policy";
import { chatPolicy } from "./chat-policy";
import { messagePolicy } from "./message-policy";
import { memberPolicy } from "./member-policy";
import { rolePolicy } from "./role-policy";

export const policy = {
  user: userPolicy,
  chat: chatPolicy,
  message: messagePolicy,
  member: memberPolicy,
  role: rolePolicy,
};
