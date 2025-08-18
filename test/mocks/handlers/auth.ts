import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";
import { db } from "../db";
import { env } from "../../../src/configs";
import { networkDelay, tokenFactory } from "../utils";

const baseUrl = `${env.SERVER_URL}/api/v${env.API_VERSION}/auth`;
const tokenSecret = env.TOKEN_SECRET;
const Token = tokenFactory({ secret: tokenSecret, idGenerator: faker.string.uuid });

interface RegisterRequestBody {
  username: string;
  password: string;
  displayName?: string;
}

interface LoginRequestBody {
  username: string;
  password: string;
}

export const authHandlers = [
  http.get("", (r) => {
    r;
  }),
  http.post<any, RegisterRequestBody>(`${baseUrl}/register`, async ({ request }) => {
    try {
      await networkDelay();

      const userData = await request.json();

      const userExist = db.user.findFirst({
        where: {
          username: {
            equals: userData.username,
          },
        },
      });

      if (userExist) {
        return HttpResponse.json(
          {
            messge: "Validation Error",
            errors: [
              {
                code: "custom",
                message: "Username is unavailable. Try adding numbers, underscores _. or periods.",
                path: ["username"],
              },
            ],
          },
          { status: 409 }
        );
      }

      const user = db.user.create({
        username: userData.username,
        password: userData.password,
      });

      db.profile.create({
        user,
        displayName: userData?.displayName,
      });

      return new HttpResponse(null, { status: 204 });
    } catch (e) {
      return HttpResponse.json({ message: e?.message || "Server Error" }, { status: 500 });
    }
  }),
  http.post<any, LoginRequestBody>(`${baseUrl}/login`, async ({ request }) => {
    await networkDelay();

    try {
      const userData = await request.json();

      const user = db.user.findFirst({
        where: {
          username: {
            equals: userData.username,
          },
        },
      });

      if (!user || user?.password !== userData.password) {
        return HttpResponse.json(
          { message: "Invalid user credentials", errors: null },
          { status: 422 }
        );
      }

      const refreshToken = Token.refreshToken(user.id, 1);
      const token = Token.accessToken(user.id, 5);

      return HttpResponse.json(
        { token },
        {
          status: 200,
          headers: {
            "Set-Cookie": `refreshToken=${refreshToken}`,
          },
        }
      );
    } catch (e) {
      return HttpResponse.json(
        { message: e?.message ?? "Server Error" },
        { status: e?.code ?? 500 }
      );
    }
  }),
  http.post(`${baseUrl}/refresh-tokens`, async () => {
    try {
      const refreshTokenCookie = document.cookie.split("=")[1];

      if (typeof refreshTokenCookie === "undefined") {
        return HttpResponse.json({ message: "Invalid or expired token" }, { status: 401 });
      }

      const verifiedToken = Token.verifyToken(refreshTokenCookie);

      const { sub } = verifiedToken;

      const refreshToken = Token.refreshToken(sub, 1);
      const token = Token.accessToken(sub, 5);

      return HttpResponse.json(
        { token },
        {
          status: 200,
          headers: {
            "Set-Cookie": `refreshToken=${refreshToken}`,
          },
        }
      );
    } catch (e) {
      return HttpResponse.json(
        { message: e?.message ?? "Server Error" },
        { status: e?.code ?? 500 }
      );
    }
  }),
];
