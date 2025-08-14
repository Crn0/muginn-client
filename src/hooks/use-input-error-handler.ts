import { useEffect } from "react";
import type { FieldError, ErrorOption } from "react-hook-form";

import type { ValidationError } from "@/errors";

type ServerError = InstanceType<typeof ValidationError>;

interface UseInputErrorHandlerOptions {
  formError: FieldError | null;
  serverError: ServerError | null;
  setError: (name: string, error: ErrorOption) => void;
}

const invalidCredential = (error: Error | null) =>
  error?.message === "Invalid user credentials"
    ? { code: "invalid_credentials", message: error.message }
    : null;

export function useInputErrorHandler(
  field: string,
  { setError, formError, serverError }: UseInputErrorHandlerOptions
) {
  const clientSide = formError;
  const serverSide = serverError;
  const fieldError =
    serverError?.fields?.find?.((e) => e.path.includes(field)) || invalidCredential(serverError);

  if (fieldError) {
    serverSide.isServerError = true;
    serverSide.message = fieldError.message;
  }

  useEffect(() => {
    if (serverSide?.isServerError && fieldError) {
      setError(field, { type: fieldError.code, message: serverSide.message });
    }
  }, [setError, field]);

  return clientSide || serverSide;
}
