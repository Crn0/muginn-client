import type {
  HttpResponseResolver,
  StrictRequest,
  DefaultBodyType,
  PathParams,
  JsonBodyType,
} from "msw";

import type { GetEntity } from "../db";

import { AuthError } from "../../../src/errors";

export type TInput<Params, RequestBodyType extends JsonBodyType> = {
  request: StrictRequest<RequestBodyType>;
  requestId: string;
  params: Params;
  cookies: Record<string, string>;
  user: GetEntity<"user">;
};

export function withAuth<
  Params extends PathParams,
  RequestBodyType extends DefaultBodyType,
  ResponseBodyType extends DefaultBodyType,
>(
  resolver: HttpResponseResolver<Params, RequestBodyType, ResponseBodyType>
): HttpResponseResolver<Params, RequestBodyType, ResponseBodyType> {
  return async (input) => {
    const { request } = input;

    if (!request.headers.get("Authorization")) {
      const error = new AuthError({ message: "Required 'Authorization' header is missing" });

      throw error;
    }

    return resolver(input);
  };
}
