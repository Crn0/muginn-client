import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

import FieldWrapper from "./field-wrapper";
import errorHandler from "./error-handler";

const Input = forwardRef(
  ({ label, serverError, className, type, name, required, onBlur = () => () => {} }, ref) => {
    const {
      register,
      trigger,
      formState: { errors },
    } = useFormContext();

    const error = errorHandler(name, {
      serverError,
      formError: errors,
    });

    return (
      <FieldWrapper label={label} error={error} isRequired={required}>
        <input
          name={name}
          type={type}
          className={className}
          aria-invalid={error?.message ? "true" : "false"}
          onBlur={onBlur(trigger)(name)}
          ref={ref}
          {...register(name)}
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
  onBlur: PropTypes.func,
};

export default Input;
