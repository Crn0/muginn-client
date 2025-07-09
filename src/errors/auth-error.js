import CustomError from "./custom-error";

export default class AuthError extends CustomError {
  constructor({
    message,
    response,
    data,
    code = 401,
    name = "Authentication Error",
    isOperational = true,
  }) {
    super(name, isOperational, message, code, response, data);
  }
}
