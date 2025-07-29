import z from "zod";
import { http, HttpResponse } from "msw";

import db from "../db";
import { env } from "../../../src/configs";
import { withAuth, withUser } from "./middleware";
import { networkDelay } from "../utils";

const chatType = z.enum(["DirectChat", "GroupChat"]);

const baseUrl = `${env.getValue("serverUrl")}/api/v${env.getValue("apiVersion")}/chats`;

const directChatCondition = (data, ctx) => {
  const dataSchema = z.object({
    memberIds: z.array(z.string().uuid()).min(2).max(2),
  });

  const issues = dataSchema.safeParse(data)?.error?.issues;

  if (issues?.length) {
    issues.forEach((issue) => ctx.addIssue({ ...issue }));
  }
};

const groupChatCondition = (data, ctx) => {
  const nameIsOverHundredCharacters =
    z
      .string()
      .max(100)
      .safeParse(data.name ?? "").success === false;

  if (nameIsOverHundredCharacters) {
    ctx.addIssue({
      code: "too_big",
      maximum: 100,
      type: "string",
      inclusive: true,
      exact: false,
      message: "Name must contain at most 100 character(s)",
      path: ["name"],
    });
  }
};

const requestBodySchema = z
  .object({
    type: chatType,
    name: z.string().max(100, { message: "Name must contain at most 100 character(s)" }),
    membersId: z.array(z.string().uuid()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "DirectChat") {
      return directChatCondition(data, ctx);
    }

    return groupChatCondition(data, ctx);
  });

export default [
  http.get(
    baseUrl,
    withAuth(
      withUser(async ({ user }) => {
        await networkDelay();

        const chats =
          db.userOnChat.findMany(user).map(({ chat }) => ({
            id: chat.id,
            name: chat.name ?? "",
            avatar: chat.avatar ?? null,
            type: chat.type,
            isPrivate: chat.isPrivate,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
            ownerId: chat?.owner?.id ?? null,
          })) ?? [];

        return HttpResponse.json(chats, {
          status: 200,
        });
      })
    )
  ),
  http.get(
    `${baseUrl}/:chatId`,
    withAuth(
      withUser(async ({ params }) => {
        await networkDelay();

        try {
          const { chatId } = params;

          const chat = db.chat.findFirst({
            where: {
              id: {
                equals: chatId,
              },
            },
          });

          return HttpResponse.json(
            {
              ...chat,
              ownerId: chat.owner.id,
              avatar: chat?.avatar ?? null,
              updatedAt: chat?.updatedAt ? new Date(chat.updatedAt).toISOString() : null,
            },
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
  http.get(
    `${baseUrl}/:chatId/me`,
    withAuth(
      withUser(async ({ user, params }) => {
        await networkDelay();

        try {
          const { chatId } = params;

          const membership = db.userOnChat.findFirst({
            where: {
              chat: {
                id: {
                  equals: chatId,
                },
              },
              user: {
                id: {
                  equals: user.id,
                },
              },
            },
          });

          return HttpResponse.json(membership, {
            status: 200,
          });
        } catch (e) {
          return HttpResponse.json({ message: e?.message || "Server Error" }, { status: 500 });
        }
      })
    )
  ),
  http.get(
    `${baseUrl}/:chatId/members`,
    withAuth(
      withUser(async ({ params }) => {
        await networkDelay();

        try {
          const { chatId } = params;

          const members = db.userOnChat
            .findMany({
              where: {
                chat: {
                  id: {
                    equals: chatId,
                  },
                },
              },
            })
            .map((member) => ({
              ...member.user,
              status: "Online",
              lastSeenAt: null,
              profile: {
                ...db.profile.findFirst({
                  where: {
                    user: { id: { equals: member.user.id } },
                  },
                }),
                displayName: null,
                avatar: null,
              },
              serverProfile: {
                ...member,
                mutedUntil: null,
              },
            }));

          return HttpResponse.json(
            {
              members,
              memberCount: members?.length ?? 0,
              pagination: { prevHref: null, nextHref: null },
            },
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
  http.post(
    baseUrl,
    withAuth(
      withUser(async ({ request, user }) => {
        await networkDelay();
        let createdChat;
        try {
          const body = requestBodySchema.safeParse(
            Object.fromEntries(await request.clone().formData())
          );

          if (!body.success) {
            return HttpResponse.json(
              {
                message: `Validation failed: ${body.error.issues.length} errors detected in body`,

                errors: body.error.issues,
              },
              { status: 422 }
            );
          }

          const { data } = body;

          const permissions = db.permission.findMany({
            name: {
              in: ["send_message", "view_chat"],
            },
          });

          if (data.type === "GroupChat") {
            createdChat = db.chat.create({
              owner: user,
              name: data.name,
              type: data.type,
              isPrivate: false,
            });

            const roles = [
              db.role.create({
                permissions,
                chat: createdChat,
              }),
            ];

            db.userOnChat.create({
              user,
              roles,
              chat: createdChat,
            });
          } else {
            createdChat = db.chat.create({
              type: data.type,
              isPrivate: true,
            });

            const users = db.user.findMany({ where: { id: { in: [data.memberIds] } } });

            const roles = [
              db.role.create({
                permissions,
                chat: createdChat,
              }),
            ];

            users.forEach((u) =>
              db.userOnChat.create({
                roles,
                user: u,
                chat: createdChat,
              })
            );
          }
        } catch (e) {
          return HttpResponse.json({ message: e?.message || "Server Error" }, { status: 500 });
        }

        return HttpResponse.json({ id: createdChat.id }, { status: 200 });
      })
    )
  ),
  http.patch(
    `${baseUrl}/:chatId/profile`,
    withAuth(
      withUser(async ({ request, params }) => {
        try {
          const { chatId } = params;
          const body = await request.clone().formData();

          const chat = db.chat.update({
            where: { id: { equals: chatId } },
            data: {
              ...Object.fromEntries(body),
            },
          });

          return HttpResponse.json({ id: chat.id }, { status: 200 });
        } catch (e) {
          return HttpResponse.json({ message: e?.message || "Server Error" }, { status: 500 });
        }
      })
    )
  ),
];
