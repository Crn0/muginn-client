import type { ApiError, AuthError, InvalidError, RedirectError, ValidationError } from "@/errors";

export type TErrorTypes = ApiError | AuthError | ValidationError | RedirectError | InvalidError;
