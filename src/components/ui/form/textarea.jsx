import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

import FieldWrapper from "./field-wrapper";
import errorHandler from "./error-handler";

const TextArea = forwardRef(
  ({ label, serverError, className, name, maxLength, required, ...props }, ref) => {
    const {
      register,
      formState: { errors },
    } = useFormContext();

    const error = errorHandler(name, {
      serverError,
      formError: errors,
    });

    return (
      <FieldWrapper label={label} error={error} isRequired={required}>
        <textarea
          name={name}
          className={className}
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
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
  required: PropTypes.bool,
  serverError: PropTypes.instanceOf(Error),
};

export default TextArea;
