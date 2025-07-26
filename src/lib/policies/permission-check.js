export default (subject, requiredPermissions) =>
  subject.roles.some((role) => role.permissions.some((p) => requiredPermissions.includes(p.name)));
