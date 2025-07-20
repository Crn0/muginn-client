import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "../button";

export default function FormConfirmation({ message, isSubmitting, renderSubmitButton }) {
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
    <div>
      <div>
        <p>{message}</p>
      </div>

      <div>
        <div>
          <Button
            type='button'
            onClick={() => {
              reset();
              setHasMadeChange(false);
            }}
            disabled={isSubmitting}
          >
            Reset
          </Button>
        </div>
        <div>{renderSubmitButton()}</div>
      </div>
    </div>
  );
}

FormConfirmation.propTypes = {
  message: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  renderSubmitButton: PropTypes.func.isRequired,
};
