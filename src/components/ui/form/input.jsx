import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

import FieldWrapper from "./field-wrapper";
import { useInputErrorHandler } from "../../../hooks";
import { cn } from "../../../utils";

const Input = forwardRef(
  ({ label, serverError, className, type, name, required, onChange = () => {}, ...props }, ref) => {
    const {
      register,
      setError,
      formState: { errors },
    } = useFormContext();

    const { ...rest } = register(name);

    const error = useInputErrorHandler(name, {
      serverError,
      setError,
      formError: errors,
    });

    return (
      <FieldWrapper
        className='sm:h-auto sm:flex-0'
        label={label}
        error={error}
        isRequired={required}
      >
        <input
          name={name}
          type={type}
          aria-invalid={error?.message ? "true" : "false"}
          className={cn(
            "border-2 border-gray-900 bg-gray-950 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none",
            className
          )}
          ref={ref}
          {...rest}
          {...props}
          onChange={(e) => {
            rest.onChange(e);
            onChange(e);
          }}
        />
      </FieldWrapper>
    );
  }
);

Input.displayName = "Input";

Input.propTypes = {
  label: PropTypes.node,
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  serverError: PropTypes.instanceOf(Error),
  onChange: PropTypes.func,
};

export default Input;
