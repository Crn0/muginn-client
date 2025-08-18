import { faker } from "@faker-js/faker";

import { env } from "../../../src/configs";
import { db, GetEntity } from "../db";
import { AuthError } from "../../../src/errors";
import { tokenFactory } from "../utils";

const tokenSecret = env.TOKEN_SECRET;

const Token = tokenFactory({ secret: tokenSecret, idGenerator: faker.string.uuid });

const isAuthUser = (user: any): user is GetEntity<"user"> => {
  return (user as GetEntity<"user">) != undefined;
};

export const getAuthUser = (headers: Headers) => {
  const bearerHeader = headers.get("Authorization");

  const bearer = bearerHeader?.split?.(" ")[1];
  const accessToken = bearer;

  if (!accessToken) {
    const error = new AuthError({ message: "Invalid or expired access token" });

    throw error;
  }

  const verifiedToken = Token.verifyToken(accessToken);

  const { sub } = verifiedToken;

  const user = db.user.findFirst({
    where: {
      id: {
        equals: sub,
      },
    },
  });

  if (!isAuthUser(user)) {
    const error = new AuthError({ message: "User not found", code: 404 });

    throw error;
  }

  return user;
};
