import { ErrorBoundary } from "react-error-boundary";
import { Suspense, useEffect } from "react";
import {
  useSearchParams,
  useLoaderData,
  Await,
  useAsyncValue,
  useNavigate,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { paths } from "@/configs";
import { getAuthUserQueryOptions } from "@/lib";
import { chatSocket } from "@/features/chats/socket";
import { RedirectErrorElement, ErrorElement } from "@/components/errors";
import { Spinner } from "@/components/ui/spinner";

function Wrapper() {
  const token = useAsyncValue() as string | null;

  const user = useQuery({
    ...getAuthUserQueryOptions(),
    enabled: !!token,
    throwOnError: (e) =>
      (e.response && e.response?.status >= 500) || e?.message === "Failed to Fetch",
  });

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get("redirectTo");

  useEffect(() => {
    if (!token) {
      if (chatSocket.connected) {
        chatSocket.disconnect();
      }

      navigate(paths.login.getHref({ redirectTo }), { replace: true });
      return;
    }

    if (user.data) {
      navigate(redirectTo || paths.protected.dashboard.me.getHref(), { replace: true });
    }
  }, [navigate, redirectTo, token, user.data, user.isError]);

  return (
    <div className='flex min-h-dvh items-center-safe justify-center-safe bg-black text-white'>
      <Spinner />
    </div>
  );
}

export function SilentLoginPage() {
  const loaderData = useLoaderData() as { data: Promise<string | null> };

  return (
    <Suspense
      fallback={
        <div className='flex min-h-dvh items-center-safe justify-center-safe bg-black text-white'>
          <Spinner />
        </div>
      }
    >
      <Await resolve={loaderData?.data} errorElement={<RedirectErrorElement />}>
        <ErrorBoundary FallbackComponent={ErrorElement}>
          <Wrapper />
        </ErrorBoundary>
      </Await>
    </Suspense>
  );
}
