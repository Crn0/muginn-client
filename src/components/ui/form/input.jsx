import PropTypes from "prop-types";
import { forwardRef } from "react";

import FieldWrapper from "./field-wrapper";

const Input = forwardRef(
  ({ label, error, className, type, name, registration, required, ...props }, ref) => (
    <FieldWrapper label={label} error={error} isRequired={required}>
      <input
        name={name}
        type={type}
        className={className}
        aria-invalid={error?.[name] ? "true" : "false"}
        ref={ref}
        {...registration}
        {...props}
      />
    </FieldWrapper>
  )
);

Input.displayName = "Input";

Input.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.instanceOf(Element),
    ])
  ),
  registration: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func])),
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
};

export default Input;
