import { ApiError } from "./api-error";
import { AuthError } from "./auth-error";
import { InvalidError } from "./invalid-error";
import { RedirectError } from "./redirect-error";
import { ValidationError } from "./validation-error";

export interface ICustomError extends Error {
  code: number;
  response?: Response;
  isOperational: boolean;
}

export interface ICustomErrorOptions {
  name: string;
  message: string;
  code: number;
  response?: Response;
  isOperational: boolean;
}

export class CustomError extends Error implements ICustomError {
  private _code: number;
  private _isOperational: boolean;
  private _response?: Response;

  isApiError(): this is ApiError {
    return this instanceof ApiError;
  }

  isAuthError(): this is AuthError {
    return this instanceof AuthError;
  }

  isInvalidError(): this is InvalidError {
    return this instanceof InvalidError;
  }

  isRedirectError(): this is RedirectError {
    return this instanceof RedirectError;
  }

  isValidationError(): this is ValidationError {
    return this instanceof ValidationError;
  }

  constructor({ name, isOperational, message, code, response }: ICustomErrorOptions) {
    super(message);
    this.name = name;
    this._isOperational = isOperational;
    this._code = code;
    this._response = response;

    Object.setPrototypeOf(this, new.target.prototype);
  }

  get code() {
    return this._code;
  }

  get isOperational() {
    return this._isOperational;
  }

  get response() {
    return this._response;
  }
}
