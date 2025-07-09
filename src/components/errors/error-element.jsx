import PropTypes from "prop-types";

import { useErrorBoundary } from "react-error-boundary";
import { Button } from "../ui/button";

export default function ErrorElement({ error }) {
  const { resetBoundary } = useErrorBoundary();

  return (
    <div role='alert'>
      <p>Error {error.code || error.status}: Something went wrong</p>
      <pre className='text-red-600'>{error.message}</pre>
      {error.fields?.length > 0 && (
        <ul className='ml-4 list-disc'>
          {error.fields.map((field) => (
            <li key={`${field.path?.join(".")}:${field.message}`}>{field.message}</li>
          ))}
        </ul>
      )}
      <Button type='button' testId='retry' onClick={() => resetBoundary()}>
        Try again
      </Button>
    </div>
  );
}

ErrorElement.propTypes = {
  error: PropTypes.instanceOf(Error).isRequired,
};
