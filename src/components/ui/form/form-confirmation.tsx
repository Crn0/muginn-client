import { useState, useEffect, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "../button";

export interface FormConfirmationProps {
  message: string;
  isSubmitting: boolean;
  renderSubmitButton: () => ReactNode;
  onReset: () => void;
}

export function FormConfirmation({
  message,
  isSubmitting,
  renderSubmitButton,
  onReset = () => {},
}: FormConfirmationProps) {
  const {
    reset,
    formState: { isDirty },
  } = useFormContext();
  const [hasMadeChange, setHasMadeChange] = useState(false);

  useEffect(() => {
    if (isSubmitting) return;

    if (hasMadeChange && !isDirty) {
      setHasMadeChange(false);
    }

    if (!hasMadeChange && isDirty) {
      setHasMadeChange(true);
    }
  }, [hasMadeChange, isDirty, isSubmitting]);

  if (!hasMadeChange) return null;

  return (
    <div className='fixed top-11/12 z-50 flex items-center-safe justify-center-safe gap-2 border-2 border-gray-900 bg-gray-950 p-2 sm:left-5/12'>
      <p>{message}</p>

      <Button
        type='button'
        onClick={() => {
          reset();
          setHasMadeChange(false);
          onReset();
        }}
        disabled={isSubmitting}
      >
        Reset
      </Button>

      {renderSubmitButton()}
    </div>
  );
}
