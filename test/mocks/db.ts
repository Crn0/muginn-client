/* eslint-disable import/prefer-default-export */
import { factory, nullable, primaryKey, oneOf, manyOf } from "@mswjs/data";
import { faker } from "@faker-js/faker";

export type DB = typeof db;

export type GetEntity<Key extends keyof DB> = ReturnType<DB[Key]["create"]>;

export type GetValue<Entity, Key extends keyof Entity> = Key extends keyof Entity
  ? Entity[Key]
  : never;

export const db = factory({
  image: {
    id: primaryKey(faker.string.uuid),
    url: String,
    format: String,
    size: Number,
  },
  user: {
    id: primaryKey(faker.string.uuid),
    username: String,
    email: nullable(String),
    password: String,
    accountLevel: Number,
    createdAt: () => new Date().toISOString(),
    updatedAt: nullable(Date),
    lastSeenAt: nullable(Date),
    status: String,
    profile: oneOf("profile"),
  },
  profile: {
    id: primaryKey(faker.string.uuid),
    displayName: nullable(String),
    aboutMe: nullable(String),
    createdAt: () => new Date().toISOString(),
    updatedAt: nullable(Date),
    avatar: nullable({
      url: String,
      images: manyOf("image"),
    }),
    backgroundAvatar: nullable({
      url: String,
      images: manyOf("image"),
    }),
    user: oneOf("user"),
  },
  chat: {
    id: primaryKey(faker.string.uuid),
    name: nullable(String),
    avatar: nullable({
      url: String,
      images: manyOf("image"),
    }),
    isPrivate: Boolean,
    type: String,
    owner: nullable(oneOf("user")),
    members: manyOf("userOnChat"),
    createdAt: () => new Date().toISOString(),
    updatedAt: nullable(Date),
    chatRoleCounter: nullable(Number),
  },
  role: {
    id: primaryKey(faker.string.uuid),
    name: String,
    roleLevel: Number,
    isDefaultRole: Boolean,
    chat: oneOf("chat"),
    members: manyOf("userOnChat"),
    permissions: manyOf("permission"),
    createdAt: () => new Date().toISOString(),
    updatedAt: nullable(Date, { defaultsToNull: true }),
  },
  permission: {
    id: primaryKey(faker.string.uuid),
    name: String,
    members: manyOf("userOnChat"),
    roles: manyOf("role"),
    createdAt: () => new Date().toISOString(),
    updatedAt: nullable(Date, { defaultsToNull: true }),
  },
  userOnChat: {
    id: primaryKey(faker.string.uuid),
    user: oneOf("user"),
    chat: oneOf("chat"),
    roles: manyOf("role"),
    joinedAt: () => new Date().toISOString(),
    mutedUntil: nullable(Date, { defaultsToNull: true }),
  },
});
