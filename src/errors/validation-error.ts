import type { ZodIssue } from "zod";
import { CustomError, type ICustomErrorOptions, type ICustomError } from "./custom-error";

interface IValidationErrorOptions extends Partial<ICustomErrorOptions> {
  message: string;
  fields: ZodIssue[] | [];
  isServerError?: boolean;
}

interface IValidationError extends Partial<ICustomError> {
  fields: ZodIssue[] | [];
  isServerError: boolean;
}

export class ValidationError extends CustomError implements IValidationError {
  private _fields;
  private _isServerError: boolean;

  constructor({
    message,
    fields,
    response,
    code = 422,
    isOperational = true,
    isServerError = false,
  }: IValidationErrorOptions) {
    super({ isOperational, message, code, response, name: "Validation Error" });
    this._fields = fields;
    this._isServerError = isServerError;
  }

  get fields() {
    return this._fields;
  }

  get isServerError() {
    return this._isServerError;
  }

  set isServerError(val: boolean) {
    this._isServerError = val;
  }
}
