import { CustomError, type ICustomErrorOptions } from "./custom-error";

interface InvalidErrorErrorOptions extends Partial<ICustomErrorOptions> {
  message: string;
  code?: number;
}

export class InvalidError extends CustomError {
  constructor({ message, code = 422, isOperational = true }: InvalidErrorErrorOptions) {
    super({ message, code, isOperational, name: "Invalid Error" });
  }
}
