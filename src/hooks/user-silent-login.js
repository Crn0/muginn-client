import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { paths } from "../configs";
import { useAuthStore } from "../stores";
import { useGetUser } from "../lib/auth";
import useRefreshToken from "./use-refresh-token";

export default function useSilentLogin() {
  const [searchParams] = useSearchParams();

  const { refresh, isRefreshingToken, isError, isSuccess, isPending } = useRefreshToken();

  const navigate = useNavigate();

  const redirectTo = searchParams.get("redirectTo");

  const hasToken = useAuthStore((state) => state.token) !== null;

  const user = useGetUser({
    enabled: hasToken,
  });

  const isAuth = user.data && hasToken;

  useEffect(() => {
    const ctr = new AbortController();

    const { signal } = ctr;

    if (!isRefreshingToken && !isAuth && !isPending && !isError && !isSuccess) {
      refresh(signal);
    }

    if (user.isSuccess) {
      navigate(redirectTo ?? paths.dashboard.index.getHref(), {
        replace: true,
      });
    }

    return () => ctr.abort();
  }, [
    isAuth,
    isPending,
    isError,
    isSuccess,
    isRefreshingToken,
    redirectTo,
    navigate,
    refresh,
    user.isSuccess,
  ]);
}
