import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuthStore } from "../stores";
import { useGetUser, useRefreshToken } from "../lib/auth";
import { paths } from "../configs";

export default function useSilentLogin() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const setToken = useAuthStore((state) => state.setToken);
  const resetAuthState = useAuthStore((state) => state.reset);

  const redirectTo = searchParams.get("redirectTo");

  const isAuth = useAuthStore((state) => state.token) !== null;

  const { mutate, isError, isPending } = useRefreshToken({
    onSuccess: (token) => {
      setToken(token);
    },
  });

  const user = useGetUser({
    enabled: isAuth,
  });

  useEffect(() => {
    if (!isAuth && (!isPending || !isError)) {
      mutate();
    }

    if (user.data) {
      navigate(redirectTo ?? paths.dashboard.getHref(), {
        replace: true,
      });
    }

    if (user.isSuccess) {
      navigate(redirectTo ?? paths.dashboard.getHref(), {
        replace: true,
      });
    }

    if (user.isError) {
      resetAuthState();
    }
  }, [
    isAuth,
    redirectTo,
    navigate,
    setToken,
    resetAuthState,
    user.data,
    user.isSuccess,
    user.isError,
    mutate,
    isPending,
    isError,
  ]);
}
