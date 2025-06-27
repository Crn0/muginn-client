import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { getAuthUserQueryOptions, refreshToken } from "../lib";
import { useAuthStore } from "../stores";

export default function useRefreshToken() {
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const setToken = useAuthStore((state) => state.setToken);
  const setIsRefreshingToken = useAuthStore((state) => state.setIsRefreshingToken);

  const isRefreshingToken = useAuthStore((state) => state.isRefreshingToken);

  const refresh = useCallback(
    async (signal) => {
      setIsPending(true);
      setIsRefreshingToken(true);
      try {
        const token = await refreshToken(signal);

        queryClient.invalidateQueries({ queryKey: getAuthUserQueryOptions().queryKey });

        setIsSuccess(true);
        setToken(token);
      } catch (e) {
        setError(e);
        setIsError(true);
      } finally {
        setIsPending(false);
        // setIsRefreshingToken(false);
      }
    },
    [queryClient, setIsRefreshingToken, setToken]
  );

  const state = useMemo(
    () => ({ isRefreshingToken, isSuccess, isPending, isError, error, refresh }),
    [error, isSuccess, isError, isPending, isRefreshingToken, refresh]
  );

  return state;
}
