function makeRoute(path, parent, customHref) {
  const fullPath = parent
    ? `${parent.fullPath}/${path}`.replace(/\/+/g, "/")
    : path.startsWith("/")
      ? path
      : `/${path}`;

  return {
    path,
    fullPath,
    getHref(params = {}) {
      if (typeof customHref === "function") return customHref(params);

      let finalPath = fullPath;

      Object.entries(params).forEach(([key, value]) => {
        finalPath = finalPath.replace(`:${key}`, value);
      });

      return finalPath;
    },
  };
}

const register = makeRoute(
  "/register",
  null,
  ({ redirectTo } = {}) =>
    `/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`
);
const login = makeRoute(
  "/login",
  null,
  ({ redirectTo } = {}) =>
    `/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`
);
const silentLogin = makeRoute(
  "/silent-login",
  null,
  ({ redirectTo } = {}) =>
    `/silent-login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`
);
const app = makeRoute("/app");

// Protected root
const protectedRoot = makeRoute("/");

// Protected subroutes
const userSettings = makeRoute("users/me/user-settings", protectedRoot);

const dashboardRoot = makeRoute("chats", protectedRoot);
const dashboardMe = makeRoute("me", dashboardRoot);
const dashboardDirectChat = makeRoute(":chatId", dashboardMe);
const dashboardGroupChat = makeRoute(":chatId", dashboardRoot);

// Discovery
const discoveryRoot = makeRoute("/discovery");
const discoveryChats = makeRoute("chats", discoveryRoot);

export default {
  register,
  login,
  silentLogin,
  app,
  protected: {
    userSettings,
    root: protectedRoot,
    dashboard: {
      root: dashboardRoot,
      me: dashboardMe,
      directChat: dashboardDirectChat,
      groupChat: dashboardGroupChat,
    },
  },
  discovery: {
    root: discoveryRoot,
    chats: discoveryChats,
  },
};
