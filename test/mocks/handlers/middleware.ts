import {
  HttpResponseResolver,
  type StrictRequest,
  type DefaultBodyType,
  type PathParams,
  JsonBodyType,
} from "msw";
import { faker } from "@faker-js/faker";

import type { GetEntity } from "../db";

import { env } from "../../../src/configs";
import { tokenFactory } from "../utils";
import { AuthError } from "../../../src/errors";

export type TInput<Params, RequestBodyType extends JsonBodyType> = {
  request: StrictRequest<RequestBodyType>;
  requestId: string;
  params: Params;
  cookies: Record<string, string>;
  user: GetEntity<"user">;
};

const tokenSecret = env.TOKEN_SECRET;

const Token = tokenFactory({ secret: tokenSecret, idGenerator: faker.string.uuid });

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
