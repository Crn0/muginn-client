import type { ZodIssue, ZodError } from "zod";

export interface IResponseError {
  code: number;
  message: string;
  errors: ZodIssue[] | null;
}

export interface IValidationError extends ZodError {
  code: number;
}

export type TErrorData = IResponseError | IValidationError;
