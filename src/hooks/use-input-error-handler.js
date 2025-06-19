import { useEffect } from "react";

const invalidCredential = (error) =>
  error?.message === "Invalid user credentials" ? { message: error.message } : null;

export function useInputErrorHandler(field, { setError, formError, serverError }) {
  const clientSide = formError?.[field];
  const serverSide =
    serverError?.fields?.find?.((e) => e.path.includes(field)) || invalidCredential(serverError);

  if (serverSide) {
    serverSide.isServerError = true;
  }

  const error = clientSide || serverSide;

  useEffect(() => {
    if (error?.isServerError) {
      setError(field, { type: error.code, message: error.message });
    }
  }, [error, setError, field]);

  return error;
}
