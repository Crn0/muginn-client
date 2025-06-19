/* eslint-disable import/prefer-default-export */
import { HttpResponse } from "msw";

export function withAuth(resolver) {
  return async (input) => {
    const { request } = input;
    if (!request.headers.get("Authorization")) {
      return new HttpResponse("Required 'Authorization' header is missing", { status: 401 });
    }

    return resolver(input);
  };
}
