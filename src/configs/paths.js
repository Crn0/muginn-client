export default {
  home: { path: "/", getHref: () => "/" },
  register: {
    path: "/register",
    getHref: (redirectTo) =>
      `/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
  },
  login: {
    path: "/login",
    getHref: (redirectTo) =>
      `/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
  },
  app: { path: "/app", getHref: () => "/app" },
  user: {
    root: {
      path: "/users/me",
      getHref: () => "/users/me",
    },
    userSettings: {
      path: "profile",
      getHref: () => "/users/me/user-settings",
    },
  },
  dashboard: {
    path: "/chats/me",
    getHref: () => "/chats/me",
  },
  chat: {
    path: "/chats/me/:chatId",
    getHref: (id) => `/chats/me/${id}`,
  },
  discovery: {
    root: {
      path: "/discovery",
      getHref: () => "/discovery",
    },
    chats: {
      path: "chats",
      getHref: () => "/discovery/chats",
    },
  },
};
