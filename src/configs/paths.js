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
  silentLogin: {
    path: "/silent-login",
    getHref: (redirectTo) =>
      `/silent-login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
  },
  app: { path: "/app", getHref: () => "/app" },
  user: {
    settings: {
      path: "users/me/user-settings",
      getHref: () => "/users/me/user-settings",
    },
  },
  dashboard: {
    root: {
      path: "/chats",
      getHref: () => "/chats",
    },
    index: {
      path: "me",
      getHref: () => "/chats/me",
      directChat: {
        path: ":chatId",
        getHref: (id) => `/chats/me/${id}`,
      },
    },
    groupChat: {
      path: ":chatId",
      getHref: (id) => `/chats/${id}`,
    },
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
