/* eslint-disable import/prefer-default-export */
import { factory, nullable, primaryKey, oneOf } from "@mswjs/data";
import { faker } from "@faker-js/faker";

export default factory({
  user: {
    id: primaryKey(faker.string.uuid),
    username: String,
    email: nullable(String),
    password: String,
    accountLevel: 1,
    createdAt: () => new Date().toISOString(),
    updatedAt: nullable(Date),
    lastSeenAt: nullable(Date),
    status: "Online",
    profile: oneOf("profile"),
  },

  profile: {
    id: primaryKey(faker.string.uuid),
    displayName: nullable(String),
    aboutMe: nullable(String),
    createdAt: () => new Date().toISOString(),
    updatedAt: nullable(Date),
    lastSeenAt: nullable(Date),

    user: oneOf("user"),
  },
});
