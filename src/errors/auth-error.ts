import { CustomError, type ICustomErrorOptions } from "./custom-error";

interface IAuthErrorOptions extends Partial<ICustomErrorOptions> {
  message: string;
}

export class AuthError extends CustomError {
  constructor({ message, response, code = 401, isOperational = true }: IAuthErrorOptions) {
    super({ isOperational, message, code, response, name: "Authentication Error" });
  }
}
