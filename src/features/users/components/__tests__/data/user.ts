import type { TAuthUser } from "@/lib";
import { generateId } from "@/lib";

export const user = {
  id: generateId(),
  username: ".crno.",
  accountLevel: 1,
  email: "crno@example.com",
  status: "Online",
  openIds: [],
  joinedAt: new Date().toISOString(),
  updatedAt: null,
  lastSeenAt: null,
  profile: {
    displayName: "crno",
    aboutMe: "",
    avatar: null,
    backgroundAvatar: null,
  },
} satisfies TAuthUser;
