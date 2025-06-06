/* eslint-disable react-refresh/only-export-components */
import { getAuthUserQueryOptions, useGetUser } from "../../../lib/auth";

export const dashBoardLoader = (queryClient) => async () => {
  const query = getAuthUserQueryOptions();

  queryClient.ensureQueryData(query);

  return null;
};

function Me() {
  const { data: user } = useGetUser();

  return <p>{user?.username}</p>;
}

export default function DashBoard() {
  const user = useGetUser();

  if (user.isLoading) {
    return <p>loading...</p>;
  }

  return <Me />;
}
