import useAuthorization from "./use-authorization";

export default function Authorization({
  user,
  resource,
  action,
  data,
  environment,
  children,
  policies,
  forbiddenFallback = null,
}) {
  const { policyCheck } = useAuthorization(user, policies);

  const canAccess = policyCheck({ resource, action, data, environment });

  return canAccess ? children : forbiddenFallback;
}
