import PropTypes from "prop-types";
import { forwardRef } from "react";

import FieldWrapper from "./field-wrapper";

const TextArea = forwardRef(
  ({ label, error, className, name, maxLength, registration, required, ...props }, ref) => (
    <FieldWrapper label={label} error={error} isRequired={required}>
      <textarea
        name={name}
        className={className}
        maxLength={maxLength}
        aria-invalid={error?.[name] ? "true" : "false"}
        ref={ref}
        {...registration}
        {...props}
      />
    </FieldWrapper>
  )
);

TextArea.displayName = "TextArea";

TextArea.propTypes = {
  label: PropTypes.string.isRequired,
  registration: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func])),
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
  required: PropTypes.bool,
  error: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.instanceOf(Element),
    ])
  ),
};

export default TextArea;
