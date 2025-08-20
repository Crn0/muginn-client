import { ApiError, AuthError, ValidationError } from "@/errors";

export const handleResponseError = async (response: Response) => {
  if (!response.ok) {
    let error;
    let message = "Something went wrong";

    const resError = await response.clone().json();
    const status = response.status;

    if (typeof resError.message === "string") {
      message = resError.message;
    }

    if (status === 401) {
      error = new AuthError({ response, message, isOperational: false });
    } else if (status === 422 || status === 409) {
      error = new ValidationError({
        response,
        message,
        fields: resError.errors,
        isServerError: true,
      });
    } else {
      error = new ApiError({ response, message, code: status });
    }

    return error;
  }

  // throw new InvalidError({ message: "Api call response is OK", isOperational: false });

  return null;
};
