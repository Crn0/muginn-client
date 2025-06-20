import { http, HttpResponse } from "msw";

import db from "../db";
import { env } from "../../../src/configs";
import { withAuth } from "./middleware";
import { networkDelay, tokenFactor } from "../utils";

const baseUrl = `${env.getValue("serverUrl")}/api/v${env.getValue("apiVersion")}/users/me`;
const tokenSecret = env.getValue("tokenSecret");

const Token = tokenFactor({ secret: tokenSecret });

export default [
  http.get(
    baseUrl,
    withAuth(async ({ request }) => {
      try {
        await networkDelay();

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

        const profile = db.profile.findFirst({
          where: {
            user: {
              id: {
                equals: user.id,
              },
            },
          },
        });

        const data = { ...user };

        delete data.password;

        data.profile = {
          avatar: null,
          backgroundAvatar: null,
          displayName: profile.displayName,
          aboutMe: profile.aboutMe,
        };

        return HttpResponse.json(
          {
            ...data,
            email: data.email.length <= 1 ? null : data.email,
          },
          { status: 200 }
        );
      } catch (e) {
        return HttpResponse.json({ message: e?.message || "Server Error" }, { status: 500 });
      }
    })
  ),
  http.patch(
    `${baseUrl}/username`,
    withAuth(async ({ request }) => {
      try {
        const body = await request.clone().json();

        const bearerHeader = request.headers.get("Authorization");

        const bearer = bearerHeader?.split?.(" ");
        const accessToken = bearer[1];

        const verifiedToken = Token.verifyToken(accessToken);

        const { sub } = verifiedToken;

        const updatedUser = db.user.update({
          where: {
            id: {
              equals: sub,
            },
          },
          data: {
            username: body.username,
          },
        });

        return HttpResponse.json(
          { id: updatedUser.id, username: updatedUser.username },
          {
            status: 200,
          }
        );
      } catch (e) {
        return HttpResponse.json({ message: e?.message || "Server Error" }, { status: 500 });
      }
    })
  ),
  http.patch(
    `${baseUrl}/password`,
    withAuth(async ({ request }) => {
      try {
        const body = await request.clone().json();

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

        if (user.password !== body.oldPassword) {
          return HttpResponse.json(
            {
              message: "Validation Error",
              errors: [
                {
                  code: "custom",
                  message: "The old password provided is incorrect",
                  path: ["oldPassword"],
                },
              ],
            },
            { status: 422 }
          );
        }

        db.user.update({
          where: {
            id: {
              equals: sub,
            },
          },
          data: {
            password: body.currentPassword,
          },
        });

        document.cookie = null;

        return new HttpResponse(null, { status: 204 });
      } catch (e) {
        return HttpResponse.json({ message: e?.message || "Server Error" }, { status: 500 });
      }
    })
  ),
  http.patch(
    `${baseUrl}/profile`,
    withAuth(async ({ request }) => {
      try {
        const formData = await request.clone().formData();

        const data = { displayName: formData.get("displayName") };

        const bearerHeader = request.headers.get("Authorization");

        const bearer = bearerHeader?.split?.(" ");
        const accessToken = bearer[1];

        const verifiedToken = Token.verifyToken(accessToken);

        const { sub } = verifiedToken;

        if (data.displayName) {
          db.profile.update({
            where: {
              user: {
                id: {
                  equals: sub,
                },
              },
            },
            data: {
              displayName: data.displayName,
            },
          });
        }

        return HttpResponse.json(
          { id: sub },
          {
            status: 200,
          }
        );
      } catch (e) {
        return HttpResponse.json({ message: e?.message || "Server Error" }, { status: 500 });
      }
    })
  ),
];
