const invalidCredential = (error) =>
  error?.message === "Invalid user credentials" ? { message: error.message } : null;

export default function errorHandler(field, { formError, serverError }) {
  return (
    formError?.[field] ||
    serverError?.fields?.find?.((e) => e.path.includes(field)) ||
    invalidCredential(serverError)
  );
}
