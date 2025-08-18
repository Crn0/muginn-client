import { http, HttpResponse } from "msw";

import { db } from "../db";
import { env } from "../../../src/configs";
import { withAuth } from "./middleware";
import { networkDelay } from "../utils";
import { getAuthUser } from "./get-user";

const baseUrl = `${env.SERVER_URL}/api/v${env.API_VERSION}/users/me`;

export const userHandlers = [
  http.get(
    baseUrl,
    withAuth(async ({ request }) => {
      try {
        await networkDelay();

        const user = getAuthUser(request.headers);

        const profile = db.profile.findFirst({
          where: {
            user: {
              id: {
                equals: user.id,
              },
            },
          },
        });

        const { password, ...data } = user;

        return HttpResponse.json(
          {
            ...data,
            email: data.email,
            status: "Online",
            joinedAt: new Date().toISOString(),
            updatedAt: null,
            lastSeenAt: null,
            openIds: [],
            profile: {
              ...data.profile,
              avatar: null,
              backgroundAvatar: null,
              displayName: profile?.displayName ?? "",
              aboutMe: profile?.aboutMe ?? "",
            },
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

        const user = getAuthUser(request.headers);

        const updatedUser = db.user.update({
          where: {
            id: {
              equals: user.id,
            },
          },
          data: {
            username: body.username,
          },
        });

        return HttpResponse.json(
          { id: updatedUser?.id, username: updatedUser?.username },
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

        const user = getAuthUser(request.headers);

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
              equals: user.id,
            },
          },
          data: {
            password: body.currentPassword,
          },
        });

        document.cookie = "";

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

        const user = getAuthUser(request.headers);

        const data = Object.fromEntries(formData);

        if (data.displayName) {
          db.profile.update({
            where: {
              user: {
                id: {
                  equals: user.id,
                },
              },
            },
            data: {
              ...data,
            },
          });
        }

        return HttpResponse.json(
          { id: user.id },
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
