import { http, HttpResponse } from "msw";

import db from "../db";
import { env } from "../../../src/configs";
import { withAuth, withUser } from "./middleware";
import { networkDelay } from "../utils";

const baseUrl = `${env.getValue("serverUrl")}/api/v${env.getValue("apiVersion")}/users/me`;

export default [
  http.get(
    baseUrl,
    withAuth(
      withUser(async ({ user }) => {
        try {
          await networkDelay();

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
    )
  ),
  http.patch(
    `${baseUrl}/username`,
    withAuth(
      withUser(async ({ request, user }) => {
        try {
          const body = await request.clone().json();

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
            { id: updatedUser.id, username: updatedUser.username },
            {
              status: 200,
            }
          );
        } catch (e) {
          return HttpResponse.json({ message: e?.message || "Server Error" }, { status: 500 });
        }
      })
    )
  ),
  http.patch(
    `${baseUrl}/password`,
    withAuth(
      withUser(async ({ request, user }) => {
        try {
          const body = await request.clone().json();

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

          document.cookie = null;

          return new HttpResponse(null, { status: 204 });
        } catch (e) {
          return HttpResponse.json({ message: e?.message || "Server Error" }, { status: 500 });
        }
      })
    )
  ),
  http.patch(
    `${baseUrl}/profile`,
    withAuth(
      withUser(async ({ request, user }) => {
        try {
          const formData = await request.clone().formData();

          const data = { displayName: formData.get("displayName") };

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
                displayName: data.displayName,
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
    )
  ),
];
