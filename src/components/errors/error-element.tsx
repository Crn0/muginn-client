import { useErrorBoundary } from "react-error-boundary";

import { CustomError, ValidationError } from "@/errors";
import { Button } from "@/components/ui/button";

const isCustomError = (e: Error | CustomError): e is CustomError =>
  (e as CustomError)?.is !== undefined;

const getErrorCode = (e: Error | CustomError) => {
  const defaultCode = 500;

  if (isCustomError(e)) {
    return e.code || e.response?.status || defaultCode;
  }

  return defaultCode;
};

export function ErrorElement({ error }: { error: InstanceType<typeof Error> }) {
  const { resetBoundary } = useErrorBoundary();

  return (
    <div role='alert'>
      <p>Error {getErrorCode(error)}: Something went wrong</p>
      <pre className='text-red-600'>{error.message}</pre>
      {isCustomError(error) && error.is(ValidationError) && error.fields?.length > 0 && (
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
