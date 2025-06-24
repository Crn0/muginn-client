import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import FileWrapper from "./file-wrapper";
import { useInputErrorHandler } from "../../../hooks";

const File = forwardRef(
  (
    { label, renderFieldButton, serverError, className, name, accept, testId, onKeyDown, required },
    ref
  ) => {
    const {
      register,
      setError,
      formState: { errors },
    } = useFormContext();
    const fieldButton = typeof renderFieldButton === "function" ? renderFieldButton() : null;

    const { ref: inputRef, ...rest } = register(name);

    const error = useInputErrorHandler(name, {
      serverError,
      setError,
      formError: errors,
    });

    return (
      <div>
        {fieldButton}
        <FileWrapper
          label={label}
          className={className}
          error={error}
          onKeyDown={onKeyDown}
          isRequired={required}
        >
          <input
            {...rest}
            type='file'
            name={name}
            className='h-0 w-0 cursor-none opacity-0'
            data-testid={testId}
            aria-invalid={error ? "true" : "false"}
            accept={accept}
            ref={ref(inputRef)}
            onBlur={required ? rest.onBlur : () => {}}
          />
        </FileWrapper>
      </div>
    );
  }
);

File.displayName = "File";

File.propTypes = {
  label: PropTypes.string.isRequired,
  renderFieldButton: PropTypes.func,
  registration: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func])),
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  accept: PropTypes.string.isRequired,
  required: PropTypes.bool,
  serverError: PropTypes.instanceOf(Error),
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  testId: PropTypes.string,
};

export default File;
