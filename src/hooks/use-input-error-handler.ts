import { useEffect } from "react";

import type { ErrorOption } from "react-hook-form";

import { ValidationError } from "@/errors";

type ServerError = InstanceType<typeof ValidationError>;

interface UseInputErrorHandlerOptions {
  serverError: ServerError | null;
  setError: (name: string, error: ErrorOption) => void;
}

const isInvalidCredentials = (
  message: string | undefined
): message is "invalid user credentials" => {
  return (message as "invalid user credentials")?.toLowerCase() === "invalid user credentials";
};

export function useInputErrorHandler(
  field: string,
  { setError, serverError }: UseInputErrorHandlerOptions
) {
  const fieldError = serverError?.fields?.find?.((e) => e.path.includes(field));

  useEffect(() => {
    if (isInvalidCredentials(serverError?.message) && field === "username") {
      setError(field, { type: "invalid_credentials", message: serverError.message });
    }

    if (fieldError) {
      setError(field, { type: fieldError.code, message: fieldError.message });
    }
  }, [setError, serverError, fieldError, field]);
}
