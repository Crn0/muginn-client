const invalidCredential = (error) =>
  error?.message === "Invalid user credentials" ? { message: error.message } : null;

export default function errorHandler(field, { formError, fieldErrors, credentialError }) {
  return (
    formError?.[field] ||
    fieldErrors?.find?.((e) => e.path.includes(field)) ||
    invalidCredential(credentialError)
  );
}
