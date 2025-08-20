import { CustomError } from "@/errors";

import { debug } from "./debug";

export type OperationSuccess<T> = { error: null; data: T };
export type OperationFailure<E> = { error: E; data: null };
export type OperationResult<T, E> = OperationSuccess<T> | OperationFailure<E>;

type Operation<T> = Promise<T> | (() => Promise<T>);
type OnFinally = (() => void) | (() => Promise<void>) | null;

export function tryCatch<T, E = CustomError>(
  operation: Promise<T>,
  onFinally?: OnFinally
): Promise<OperationResult<T, E>>;
export function tryCatch<T, E = CustomError>(
  operation: Promise<T>,
  onFinally?: OnFinally
): Promise<OperationResult<T, E>>;
export function tryCatch<T, E = CustomError>(
  operation: Operation<T>,
  onFinally?: OnFinally
): OperationResult<T, E> | Promise<OperationResult<T, E>> {
  try {
    const result = typeof operation === "function" ? operation() : operation;

    if (isPromise(result)) {
      return Promise.resolve(result)
        .then((data) => onSuccess(data))
        .catch((error) => onFailure(error));
    }

    return onSuccess(result);
  } catch (error) {
    return onFailure<E>(error);
  } finally {
    if (typeof onFinally === "function") {
      Promise.resolve(onFinally()).then(debug).catch(debug);
    }
  }
}

const onSuccess = <T>(data: T): OperationSuccess<T> => {
  return { data, error: null };
};

const onFailure = <E>(error: unknown): OperationFailure<E> => {
  const message = String(error) ?? "Something went wrong";

  const errorParsed =
    error instanceof CustomError
      ? error
      : new CustomError({ message, code: 422, isOperational: false, name: "Custom Error" });

  return { error: errorParsed as E, data: null };
};

const isPromise = <T = any>(value: unknown): value is Promise<T> => {
  return (
    !!value &&
    (typeof value === "object" || typeof value === "function") &&
    typeof (value as any).then === "function"
  );
};
