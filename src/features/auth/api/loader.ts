import type { QueryClient } from "@tanstack/react-query";

import { tryCatch, refreshToken } from "@/lib";
import { setToken } from "@/stores";

export const getRefreshToken = async (queryClient: QueryClient) => {
  const { error, data: token } = await tryCatch(refreshToken());

  if (error) {
    queryClient.clear();

    if (error?.code >= 500 || error?.message?.toLowerCase().includes("failed to fetch")) {
      throw error;
    }
    if (error?.code === 401) {
      return null;
    }
  }

  setToken(token);

  return token;
};

export const clientLoader = (queryClient: QueryClient) => () => ({
  data: getRefreshToken(queryClient),
});
