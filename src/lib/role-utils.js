export const getRolesWithRequiredPermissions = (user, requiredPermissions) =>
  user.roles.filter((role) => role.permissions.some((p) => requiredPermissions.includes(p.name)));

export const getHighestRoleLevel = (user) =>
  Math.min(
    ...(user?.roles?.reduce?.((arr, r) => {
      if (!r.roleLevel) return arr;

      return arr.concat(r.roleLevel);
    }, []) ?? [])
  );

export const isOwner = (user, chat) => user.id === chat.ownerId;

export const isAdmin = (user) =>
  user.roles.some((role) => role.permissions?.some?.((name) => name === "admin"));

export const isSameUser = (user, targetUser) => user.id === targetUser?.id;

export const isAuthor = (user, data) => user.id === data.user.id;

export const canActOn = (user, data, requiredPermissions) => {
  let targetRoles = [];

  if (Array.isArray(data)) {
    targetRoles = data;
  } else if (data?.permissions) {
    targetRoles = [data];
  } else if (data?.roles) {
    targetRoles = data.roles;
  }

  const roles = getRolesWithRequiredPermissions(user, requiredPermissions);
  const userPower = getHighestRoleLevel({ roles });
  const targetPower = getHighestRoleLevel({ roles: targetRoles });

  return userPower < targetPower;
};
