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

  is<Base>(base: { new (...args: any[]): Base }): this is Base {
    return this instanceof base;
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
