import type { TFlatPermissions } from "@/lib/authorization";
import type { IUserWithRole } from "./policy.types";

export const permissionCheck = (user: IUserWithRole, requiredPermissions: TFlatPermissions[]) =>
  user.roles.some((role) =>
    role.permissions.some(({ name }) => requiredPermissions.includes(name))
  );
