/* eslint-disable import/prefer-default-export */
import { HttpResponse } from "msw";

import db from "../db";
import { env } from "../../../src/configs";
import { tokenFactor } from "../utils";

const tokenSecret = env.getValue("tokenSecret");

const Token = tokenFactor({ secret: tokenSecret });

export function withAuth(resolver) {
  return async (input) => {
    const { request } = input;
    if (!request.headers.get("Authorization")) {
      return new HttpResponse("Required 'Authorization' header is missing", { status: 401 });
    }

    return resolver(input);
  };
}

export function withUser(resolver) {
  return async (input) => {
    const { request } = input;

    const bearerHeader = request.headers.get("Authorization");

    const bearer = bearerHeader?.split?.(" ");
    const accessToken = bearer[1];

    const verifiedToken = Token.verifyToken(accessToken);

    const { sub } = verifiedToken;

    const user = db.user.findFirst({
      where: {
        id: {
          equals: sub,
        },
      },
    });

    if (!user) {
      return HttpResponse.json(
        { message: "User not found" },
        {
          status: 404,
        }
      );
    }

    // eslint-disable-next-line no-param-reassign
    input.user = user;

    return resolver(input);
  };
}
