import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

import { getAuthUserQueryOptions } from "../../lib";
import { Spinner } from "../../components/ui/spinner";

export default function AppRoot() {
  const { isLoading } = useQuery({ ...getAuthUserQueryOptions() });

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return <Outlet />;
}
