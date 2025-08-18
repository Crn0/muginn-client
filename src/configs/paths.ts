type TParent = {
  path: string;
  getHref: () => string;
};

interface Params {
  [key: string]: string | null;
}

interface MakeRouteOptions {
  path: string;
  parent?: TParent | null;
  customHref?: ({ redirectTo }: Params) => string;
}

const makeRoute = ({ path, parent, customHref }: MakeRouteOptions) => {
  let fullPath;
  const parentHref = parent?.getHref?.();

  if (parentHref) {
    fullPath = `${parentHref}/${path}`.replace(/\/+/g, "/");
  } else if (path.startsWith("/")) {
    fullPath = path;
  } else {
    fullPath = `/${path}`;
  }

  return {
    path,
    getHref(params: Params = { redirectTo: "" }) {
      if (typeof customHref === "function") return customHref(params);

      let finalPath = fullPath;

      Object.entries(params).forEach(([key, value]) => {
        if (typeof value === "string") {
          finalPath = finalPath.replace(`:${key}`, value);
        }
      });

      return finalPath;
    },
  };
};

const register = makeRoute({
  path: "/register",
  customHref: ({ redirectTo }) =>
    `/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
});

const login = makeRoute({
  path: "/login",
  customHref: ({ redirectTo }) =>
    `/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
});
const silentLogin = makeRoute({
  path: "/silent-login",
  customHref: ({ redirectTo }) =>
    `/silent-login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
});
const app = makeRoute({ path: "/app" });

// Protected root
const protectedRoot = makeRoute({ path: "/" });

// Protected subroutes
const userSettings = makeRoute({ path: "users/me/user-settings", parent: protectedRoot });
const chatSettings = makeRoute({ path: "chats/:chatId/settings", parent: protectedRoot });

const dashboardRoot = makeRoute({ path: "chats", parent: protectedRoot });
const dashboardMe = makeRoute({ path: "me", parent: dashboardRoot });
const dashboardDirectChat = makeRoute({ path: ":chatId", parent: dashboardMe });
const dashboardGroupChat = makeRoute({ path: ":chatId", parent: dashboardRoot });

// Discovery
const discoveryRoot = makeRoute({ path: "/discovery" });
const discoveryChats = makeRoute({ path: "chats", parent: discoveryRoot });

export type TRoutePaths = typeof paths;

export const paths = {
  register,
  login,
  silentLogin,
  app,
  protected: {
    userSettings,
    chatSettings,
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
} as const;
