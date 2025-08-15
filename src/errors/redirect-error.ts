import { CustomError, type ICustomError, type ICustomErrorOptions } from "./custom-error";

interface IRedirectErrorOptions extends Partial<ICustomErrorOptions> {
  message: string;
  redirectTo: string;
}

interface IRedirectError extends Partial<ICustomError> {
  redirectTo: string;
  redirect(): void;
}

export class RedirectError extends CustomError implements IRedirectError {
  private _redirectTo: string;

  constructor({
    message,
    redirectTo,
    response,
    code = 307,
    isOperational = true,
  }: IRedirectErrorOptions) {
    super({ message, code, response, isOperational, name: "Redirect Error" });

    this._redirectTo = redirectTo;
  }

  redirect() {
    window.location.replace(this._redirectTo);
  }

  get redirectTo() {
    return this._redirectTo;
  }
}
