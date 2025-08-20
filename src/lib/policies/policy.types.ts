import type { TChat } from "@/features/chats/api";
import type { TAuthUser } from "@/lib/auth";
import type { TFlatPermissions } from "@/lib/authorization";

export type TRequiredPermissions = Readonly<TFlatPermissions[]>;

export type TPolicyResource = "user" | "chat" | "member" | "message" | "role";

export interface IUserWithRole extends Pick<TAuthUser, "id"> {
  roles: IRole[];
}

export interface IRole {
  roleLevel: number | null;
  permissions: IPermission[];
}

export interface IPermission {
  name: TFlatPermissions;
}

export interface IPolicyEnvironment {
  chat?: TChat;
  permissions?: TRequiredPermissions;
  targetRole?: IRole;
  targetRoles?: IRole[];
}
