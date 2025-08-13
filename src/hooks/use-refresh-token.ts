import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { getAuthUserQueryOptions, refreshToken, tryCatch } from "@/lib";
import { useAuthStore, getIsRefreshingToken } from "@/stores";

export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  const setToken = useAuthStore((state) => state.setToken);
  const setError = useAuthStore((state) => state.setError);
  const setIsRefreshingToken = useAuthStore((state) => state.setIsRefreshingToken);
  const setIsPending = useAuthStore((state) => state.setIsPending);
  const setIsSuccess = useAuthStore((state) => state.setIsSuccess);
  const setIsError = useAuthStore((state) => state.setIsError);

  const error = useAuthStore((state) => state.error);
  const isRefreshingToken = useAuthStore((state) => state.isRefreshingToken);
  const isSuccess = useAuthStore((state) => state.isSuccess);
  const isPending = useAuthStore((state) => state.isPending);
  const isError = useAuthStore((state) => state.isError);

  const refresh = useCallback(async () => {
    if (getIsRefreshingToken()) return;

    setIsPending(true);
    setIsRefreshingToken(true);

    const { error: e, data: token } = await tryCatch(refreshToken(), () => {
      setIsPending(false);
      setIsRefreshingToken(false);
    });

    if (e) {
      setIsError(true);
      setError(e);

      return;
    }

    setIsSuccess(true);
    setToken(token);

    queryClient.invalidateQueries({ queryKey: getAuthUserQueryOptions().queryKey });
  }, [
    queryClient,
    setError,
    setIsError,
    setIsPending,
    setIsRefreshingToken,
    setIsSuccess,
    setToken,
  ]);

  return useMemo(
    () => ({ isRefreshingToken, isSuccess, isPending, isError, error, refresh }),
    [error, isSuccess, isError, isPending, isRefreshingToken, refresh]
  );
};
