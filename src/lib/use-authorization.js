import { useMemo } from "react";
import { env } from "../configs";

const initPolicyCheck =
  (user, policies) =>
  ({ resource, action, data, environment }) => {
    const policy = policies[resource]?.[action];

    if (!policy) {
      throw new Error(`Invalid resource-action pair: ${resource}.${action}`);
    }

    if (typeof policy === "boolean") return policy;

    if (data === null || data === undefined) {
      throw new Error(`Missing data for policy check on ${resource}.${action}`);
    }

    return policy(user, data, environment);
  };

export default function useAuthorization(user, policies) {
  const policyCheck = useMemo(() => {
    if (!policies) {
      throw new Error("policies are required");
    }

    if (!user) {
      return () => {
        if (env.getValue("nodeEnv") !== "prod") {
          console.warn("Denied access: no user available for policy check.");
        }

        return false;
      };
    }

    return initPolicyCheck(user, policies);
  }, [policies, user]);

  return { policyCheck };
}
