import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuthStore } from "../stores";
import { useGetUser } from "../lib/auth";
import { paths } from "../configs";

export default function useSilentLogin() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const setToken = useAuthStore((state) => state.setToken);
  const resetAuthState = useAuthStore((state) => state.reset);

  const redirectTo = searchParams.get("redirectTo");

  const isAuth = useAuthStore((state) => state.token) !== null;

  const user = useGetUser({
    enabled: isAuth,
  });

  useEffect(() => {
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
  ]);
}
