import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import { paths } from "../configs";
import { ErrorElement } from "../components/errors";
import { AuthLayout } from "../components/layouts";
import { RegisterForm } from "../features/auth/components";

export default function RegisterPage() {
  const navigate = useNavigate();

  const onSuccess = () => {
    navigate(paths.login.getHref(), { replace: true });
  };

  return (
    <AuthLayout title='Create an account'>
      <ErrorBoundary FallbackComponent={ErrorElement}>
        <RegisterForm onSuccess={onSuccess} />
      </ErrorBoundary>
    </AuthLayout>
  );
}
