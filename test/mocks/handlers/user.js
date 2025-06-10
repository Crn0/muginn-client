import { http, HttpResponse } from "msw";
import db from "../db";
import { env } from "../../../src/configs";
import { networkDelay, tokenFactor } from "../utils";

const baseUrl = `${env.getValue("serverUrl")}/api/v${env.getValue("apiVersion")}/users/me`;
const tokenSecret = env.getValue("tokenSecret");

const Token = tokenFactor({ secret: tokenSecret });

export default [
  http.get(baseUrl, async ({ request }) => {
    try {
      await networkDelay();

      const bearerHeader = request.headers.get("Authorization");

      if (typeof bearerHeader === "undefined") {
        return HttpResponse.json(
          { message: "Required 'Authorization' header is missing" },
          {
            status: 401,
          }
        );
      }

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

      const profile = db.profile.findFirst({
        where: {
          user: {
            id: {
              equals: user.id,
            },
          },
        },
      });

      delete user.password;

      user.profile = {
        avatar: null,
        displayName: profile.displayName,
        aboutMe: profile.aboutMe,
      };

      return HttpResponse.json(
        {
          ...user,
          email: user.email.length <= 1 ? null : user.email,
        },
        { status: 200 }
      );
    } catch (e) {
      return HttpResponse.json({ message: e?.message || "Server Error" }, { status: 500 });
    }
  }),
];
