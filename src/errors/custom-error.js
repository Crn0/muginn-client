export default class CustomError extends Error {
  constructor(name, isOperational, message, code, response, data) {
    super(message);
    this.name = name;
    this.isOperational = isOperational;
    this.code = code;
    this.response = response;
    this.data = data;
  }
}
