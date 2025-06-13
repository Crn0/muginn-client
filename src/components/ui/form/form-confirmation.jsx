import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "../button";

export default function FormConfirmation({ message, renderSubmitButton }) {
  const {
    reset,
    formState: { isDirty },
  } = useFormContext();
  const [hasMadeChange, setHasMadeChange] = useState(false);

  useEffect(() => {
    if (!hasMadeChange && isDirty) {
      setHasMadeChange(true);
    }
  }, [hasMadeChange, isDirty]);

  if (!hasMadeChange) return null;

  return (
    <div>
      <div>
        <p>{message}</p>
      </div>

      <div>
        <div>
          <Button type='button' onClick={reset}>
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
  renderSubmitButton: PropTypes.func.isRequired,
};
