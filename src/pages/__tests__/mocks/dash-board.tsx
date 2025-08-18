/* eslint-disable react-refresh/only-export-components */
import type { QueryClient } from "@tanstack/react-query";

import { getAuthUserQueryOptions, useGetUser } from "@/lib/auth";
import { Spinner } from "@/components/ui/spinner";
import { ValidationError } from "@/errors";

export const dashBoardLoader = (queryClient: QueryClient) => async () => {
  const query = getAuthUserQueryOptions();

  queryClient.ensureQueryData(query);

  return null;
};

export function DashBoard() {
  const user = useGetUser();

  if (user.isLoading) {
    return <Spinner />;
  }
  console.log(user.error?.is(ValidationError) && user.error.fields);
  return <p>{user.data?.username}</p>;
}
