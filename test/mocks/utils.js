import { delay } from "msw";
import jwt, { verify } from "jsonwebtoken";

const createAccessTokenGenerator = (secret) => (id, expiresInMinutes) =>
  jwt.sign({}, secret, {
    expiresIn: `${expiresInMinutes}m`,
    subject: id,
  });

const createRefreshTokenGenerator =
  ({ secret, idGenerator }) =>
  (id, expiresInDays) =>
    jwt.sign({}, secret, {
      jwtid: idGenerator(),
      subject: id,
      expiresIn: `${expiresInDays}d`,
    });

const createVerifyToken = (secret) => (token) => jwt.verify(token, secret);

export const networkDelay = () => delay(200);

export const tokenFactor = ({ secret, idGenerator }) =>
  Object.freeze({
    accessToken: createAccessTokenGenerator(secret),
    refreshToken: createRefreshTokenGenerator({ secret, idGenerator }),
    verifyToken: createVerifyToken(secret),
  });
