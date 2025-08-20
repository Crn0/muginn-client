import { useMemo } from "react";
import { env } from "../../configs";

import { initPolicyCheck } from "./policy-check";

export const useAuthorization = <TUser, TPolicy extends Record<string, unknown>>(
  user: TUser,
  policy: TPolicy
) => {
  const policyCheck = useMemo(() => {
    if (!policy) {
      throw new Error("policies are required");
    }

    if (!user) {
      return () => {
        if (env.NODE_ENV !== "prod") {
          console.warn("Denied access: no user available for policy check.");
        }

        return false;
      };
    }

    return initPolicyCheck(user, policy);
  }, [policy, user]);

  return { policyCheck };
};
