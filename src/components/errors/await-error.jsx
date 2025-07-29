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
    <div className='grid h-dvh place-content-center place-items-center bg-black text-white'>
      <div role='alert'>
        <p className='font-extralight italic'>Something went wrong:</p>
        <pre className='text-red-600'>{error?.message || error?.statusText || "Unknown error"}</pre>
      </div>
    </div>
  );
}
