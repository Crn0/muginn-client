import { AuthError, ApiError, ValidationError } from "../errors";

export default function errorHandler(response, data) {
  const message = data?.message || "Something went wrong";
  const code = (data?.code || response?.status) ?? 500;
  const payload = data?.data ?? data;

  if ([422, 409].includes(code)) {
    throw new ValidationError({
      message,
      response,
      code,
      data: payload,
      fields: (data?.errors || data?.issues) ?? [],
    });
  }

  if (code === 401) {
    throw new AuthError({
      message,
      code,
      response,
      data: payload,
    });
  }

  throw new ApiError({
    message,
    code,
    response,
    data: payload,
  });
}
