import { CustomError, type ICustomErrorOptions } from "./custom-error";

interface IApiErrorOptions extends Partial<ICustomErrorOptions> {
  message: string;
  response: Response;
  code: number;
}

export class ApiError extends CustomError {
  constructor({ message, response, code, isOperational = true }: IApiErrorOptions) {
    super({ message, code, response, isOperational, name: "Api Error" });
  }
}
