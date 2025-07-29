import { useRouteError } from "react-router-dom";

export default function RouteErrorElement() {
  const error = useRouteError();

  return (
    <div className='grid h-dvh place-content-center place-items-center bg-black text-white'>
      <div role='alert'>
        <p className='font-extralight italic'>Something went wrong:</p>
        <pre className='text-red-600'>{error?.message || error?.statusText || "Unknown error"}</pre>
      </div>
    </div>
  );
}
