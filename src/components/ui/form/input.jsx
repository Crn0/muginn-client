import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

import FieldWrapper from "./field-wrapper";
import { useInputErrorHandler } from "../../../hooks";

const Input = forwardRef(
  ({ label, serverError, className, type, name, required, ...props }, ref) => {
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
      <FieldWrapper label={label} error={error} isRequired={required}>
        <input
          name={name}
          type={type}
          className={className}
          aria-invalid={error?.message ? "true" : "false"}
          ref={ref}
          {...register(name)}
          {...props}
        />
      </FieldWrapper>
    );
  }
);

Input.displayName = "Input";

Input.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  serverError: PropTypes.instanceOf(Error),
};

export default Input;
