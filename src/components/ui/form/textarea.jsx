import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

import { cn } from "../../../utils";
import FieldWrapper from "./field-wrapper";
import { useInputErrorHandler } from "../../../hooks";

const TextArea = forwardRef(
  ({ serverError, className, name, maxLength, required, label = "", ...props }, ref) => {
    const {
      register,
      setError,
      formState: { errors },
    } = useFormContext();

    const error = useInputErrorHandler(name, {
      serverError,
      setError,
      formError: errors,
    });

    return (
      <FieldWrapper label={label} className='items-baseline' error={error} isRequired={required}>
        <textarea
          name={name}
          className={cn("flex-1", className)}
          maxLength={maxLength}
          aria-invalid={error?.message ? "true" : "false"}
          ref={ref}
          {...register(name)}
          {...props}
        />
      </FieldWrapper>
    );
  }
);

TextArea.displayName = "TextArea";

TextArea.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
  required: PropTypes.bool,
  serverError: PropTypes.instanceOf(Error),
};

export default TextArea;
