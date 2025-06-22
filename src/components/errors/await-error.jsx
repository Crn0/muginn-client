import { useEffect } from "react";
import { useAsyncError, useNavigate } from "react-router-dom";

export default function AwaitErrorElement() {
  const error = useAsyncError();
  const navigate = useNavigate();

  useEffect(() => {
    if (error instanceof Response && error.status === 302) {
      const redirectTo = error.headers.get("Location");
      if (redirectTo) {
        navigate(redirectTo);
      }
    }
  }, [error, navigate]);

  return (
    <div role='alert'>
      <p>Something went wrong:</p>
      <pre className='text-red-600'>{error.message}</pre>
    </div>
  );
}
