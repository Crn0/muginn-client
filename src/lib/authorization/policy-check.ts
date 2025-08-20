import type { IPolicyEnvironment } from "../policies/policy.types";

export const initPolicyCheck =
  <TUser, TPolicy>(user: TUser, policies: TPolicy) =>
  <
    TEnv extends IPolicyEnvironment,
    TResource extends keyof TPolicy,
    TAction extends keyof TPolicy[TResource] = any,
    TData = unknown,
  >({
    resource,
    action,
    data,
    environment,
  }: {
    resource: TResource;
    action: TAction;
    data: TData;
    environment: TEnv;
  }) => {
    const policy = policies[resource]?.[action];

    if (!policy) {
      throw new Error(`Invalid resource-action pair: ${String(resource)}.${String(action)}`);
    }
    if (typeof policy === "boolean") return policy;

    if (typeof policy === "function") return policy(user, data, environment);

    throw new Error(`Missing data for policy check on ${String(resource)}.${String(action)}`);
  };
