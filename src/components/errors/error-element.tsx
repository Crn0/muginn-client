import { useErrorBoundary } from "react-error-boundary";

import { ValidationError, type CustomError } from "@/errors";
import { Button } from "@/components/ui/button";

export function ErrorElement({ error }: { error: InstanceType<typeof CustomError> }) {
  const { resetBoundary } = useErrorBoundary();

  return (
    <div role='alert'>
      <p>Error {error.code || error?.response?.status || 422}: Something went wrong</p>
      <pre className='text-red-600'>{error.message}</pre>
      {error.is(ValidationError) && error.fields?.length > 0 && (
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
