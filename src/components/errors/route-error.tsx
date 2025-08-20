import type { CustomError } from "@/errors";
import { useRouteError } from "react-router-dom";

export function RouteErrorElement() {
  const error = useRouteError() as CustomError;

  return (
    <div className='grid h-dvh place-content-center place-items-center bg-black text-white'>
      <div role='alert'>
        <p className='font-extralight italic'>Something went wrong:</p>
        <pre className='text-red-600'>{error?.message || "Unknown error"}</pre>
      </div>
    </div>
  );
}
