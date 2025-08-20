import type { PropsWithChildren, ReactNode } from "react";

import type { IPolicyEnvironment, IUserWithRole } from "../policies/policy.types";

import { useAuthorization } from "./use-authorization";

export interface AuthorizationProps<
  TUser,
  TPolicy,
  TEnv extends IPolicyEnvironment,
  TResource extends keyof TPolicy = keyof TPolicy,
  TAction extends keyof TPolicy[TResource] = keyof TPolicy[TResource],
  TData = unknown,
> extends PropsWithChildren {
  user: TUser;
  policy: TPolicy;
  resource: TResource;
  action: TAction;
  environment?: TEnv;
  data?: TData;
  forbiddenFallback?: ReactNode;
}

export function Authorization<
  TEnv extends IPolicyEnvironment,
  TPolicy extends Record<string, unknown>,
  TResource extends keyof TPolicy,
  TAction extends keyof TPolicy[TResource] = any,
  TUser = IUserWithRole,
>({
  user,
  resource,
  action,
  data,
  environment,
  children,
  policy,
  forbiddenFallback = null,
}: AuthorizationProps<TUser, TPolicy, TEnv, TResource, TAction>) {
  const { policyCheck } = useAuthorization<TUser, TPolicy>(user, policy);

  const canAccess = policyCheck({ resource, action, data, environment });

  return canAccess ? children : forbiddenFallback;
}
