import CustomError from "./custom-error";

export default class ValidationError extends CustomError {
  constructor({
    message,
    fields,
    response,
    data,
    code,
    name = "Validation Error",
    isOperational = true,
  }) {
    super(name, isOperational, message, code, response, data);
    this.fields = fields;
  }
}
