import { ErrorBoundary } from "react-error-boundary";
import { useNavigate, useSearchParams } from "react-router-dom";

import { paths } from "../configs";
import { useAuthStore } from "../stores";
import { AuthLayout } from "../components/layouts";
import { LoginForm } from "../features/auth/components";

export default function LoginPage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get("redirectTo");

  const setToken = useAuthStore((state) => state.setToken);

  const onSuccess = ({ token }) => {
    setToken(token);
    navigate(redirectTo || paths.dashboard.index.getHref(), { replace: true });
  };

  return (
    <AuthLayout title='Welcome back!' message="We're so excited to see you again!">
      <ErrorBoundary>
        <LoginForm onSuccess={onSuccess} />
      </ErrorBoundary>
    </AuthLayout>
  );
}
