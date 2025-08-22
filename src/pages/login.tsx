import { ErrorBoundary } from "react-error-boundary";
import { useNavigate, useSearchParams } from "react-router-dom";

import { paths } from "@/configs";
import { useAuthStore } from "@/stores";
import { ErrorElement } from "@/components/errors";
import { AuthLayout } from "@/components/layouts";
import { LoginForm } from "@/features/auth/components";

export function LoginPage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get("redirectTo");

  const setToken = useAuthStore((state) => state.setToken);

  const onSuccess = ({ token }: { token: string }) => {
    setToken(token);
    navigate(redirectTo || paths.protected.dashboard.me.getHref(), { replace: true });
  };

  return (
    <AuthLayout title='Muginn'>
      <ErrorBoundary FallbackComponent={ErrorElement}>
        <LoginForm onSuccess={onSuccess} />
      </ErrorBoundary>
    </AuthLayout>
  );
}
