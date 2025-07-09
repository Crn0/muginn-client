import PropTypes from "prop-types";

import { useErrorBoundary } from "react-error-boundary";
import { Button } from "../ui/button";

export default function ErrorElement({ error }) {
  const { resetBoundary } = useErrorBoundary();

  return (
    <div role='alert'>
      <p>Something went wrong:</p>
      <pre className='text-red-600'>{error.message}</pre>
      <Button type='button' testId='retry' onClick={() => resetBoundary()}>
        Try again
      </Button>
    </div>
  );
}

ErrorElement.propTypes = {
  error: PropTypes.instanceOf(Error).isRequired,
};
