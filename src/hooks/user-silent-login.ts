import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { paths } from "@/configs";
import { useAuthStore } from "@/stores";
import { useGetUser } from "@/lib";
import { useRefreshToken } from "./use-refresh-token";

export const useSilentLogin = () => {
  const [searchParams] = useSearchParams();

  const { refresh } = useRefreshToken();

  const navigate = useNavigate();

  const redirectTo = searchParams.get("redirectTo");

  const hasToken = useAuthStore((state) => state.token) !== null;

  const user = useGetUser({
    enabled: hasToken,
  });

  const isAuth = user.data && hasToken;

  useEffect(() => {
    if (!isAuth) {
      refresh();
    }

    if (user.isSuccess) {
      navigate(redirectTo ?? paths.protected.dashboard.me.getHref(), {
        replace: true,
      });
    }
  }, [isAuth, navigate, redirectTo, refresh, user.isSuccess]);
};
