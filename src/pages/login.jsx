import { ErrorBoundary } from "react-error-boundary";

import { useAuthStore } from "../stores";
import { AuthLayout } from "../components/layouts";
import { LoginForm } from "../features/auth/components";

export default function LoginPage() {
  const setToken = useAuthStore((state) => state.setToken);

  const onSuccess = (token) => {
    setToken(token);
  };

  return (
    <AuthLayout title='Welcome back!' message="We're so excited to see you again!">
      <ErrorBoundary>
        <LoginForm onSuccess={onSuccess} />
      </ErrorBoundary>
    </AuthLayout>
  );
}
