import { useRouteError } from "react-router-dom";

export default function RouteErrorElement() {
  const error = useRouteError();

  return (
    <div role='alert'>
      <p>Something went wrong:</p>
      <pre className='text-red-600'>{error?.message || error.statusText}</pre>
    </div>
  );
}
