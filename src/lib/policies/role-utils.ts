import type { TChat } from "@/features/chats/api";

import type { IUserWithRole, IRole, TRequiredPermissions } from "./policy.types";

export const getRolesWithRequiredPermissions = (
  user: IUserWithRole,
  requiredPermissions: TRequiredPermissions
) =>
  user.roles.filter((role) => role.permissions.some((p) => requiredPermissions.includes(p.name)));

export const getHighestRoleLevel = (roles: IRole[]) => {
  const roleLevels =
    roles.map(({ roleLevel }) => roleLevel).filter((l) => typeof l === "number") ?? [];

  return Math.min(...roleLevels);
};

export const isOwner = (user: IUserWithRole, chat: TChat) => user.id === chat.ownerId;

export const isAdmin = (user: IUserWithRole) =>
  user.roles.some((role) => role.permissions?.some?.(({ name }) => name === "admin"));

export const isSameUser = (user: IUserWithRole, targetUser: { id: string }) =>
  user.id === targetUser?.id;

export const isAuthor = <U extends { user: { id: string } }>(user: IUserWithRole, data: U) =>
  user.id === data.user.id;

export const canActOnTargetUser = (
  user: IUserWithRole,
  targetUser: IUserWithRole,
  requiredPermissions: TRequiredPermissions
) => {
  const roles = getRolesWithRequiredPermissions(user, requiredPermissions);
  const userPower = getHighestRoleLevel(roles);
  const targetPower = getHighestRoleLevel(targetUser.roles);

  return userPower < targetPower;
};

export const canActOnTargetRole = (
  user: IUserWithRole,
  targetRole: IRole,
  requiredPermissions: TRequiredPermissions
) => {
  const roles = getRolesWithRequiredPermissions(user, requiredPermissions);
  const userPower = getHighestRoleLevel(roles);
  const targetPower = targetRole.roleLevel ?? Infinity;

  return userPower < targetPower;
};
