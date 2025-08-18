import { useNavigate, useSearchParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import { paths } from "@/configs";
import { ErrorElement } from "@/components/errors";
import { AuthLayout } from "@/components/layouts";
import { RegisterForm } from "@/features/auth/components";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get("redirectTo");

  const onSuccess = () => {
    navigate(paths.login.getHref({ redirectTo }), { replace: true });
  };

  return (
    <AuthLayout title='Muginn'>
      <ErrorBoundary FallbackComponent={ErrorElement}>
        <RegisterForm onSuccess={onSuccess} />
      </ErrorBoundary>
    </AuthLayout>
  );
}
