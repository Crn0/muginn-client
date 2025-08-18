import { delay } from "msw";
import jwt from "jsonwebtoken";

const createAccessTokenGenerator = (secret: string) => (id: string, expiresInMinutes: number) =>
  jwt.sign({}, secret, {
    expiresIn: `${expiresInMinutes}m`,
    subject: id,
  });

const createRefreshTokenGenerator =
  ({ secret, idGenerator }: { secret: string; idGenerator: () => string }) =>
  (id: string, expiresInDays: number) =>
    jwt.sign({}, secret, {
      jwtid: idGenerator(),
      subject: id,
      expiresIn: `${expiresInDays}d`,
    });

export const createVerifyToken = (secret: string) => (token: string) => jwt.verify(token, secret);

export const networkDelay = () => delay(200);

export const tokenFactory = ({
  secret,
  idGenerator,
}: {
  secret: string;
  idGenerator: () => string;
}) =>
  Object.freeze({
    accessToken: createAccessTokenGenerator(secret),
    refreshToken: createRefreshTokenGenerator({ secret, idGenerator }),
    verifyToken: createVerifyToken(secret),
  });
