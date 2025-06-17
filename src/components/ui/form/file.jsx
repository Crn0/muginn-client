import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import FileWrapper from "./file-wrapper";
import errorHandler from "./error-handler";

const File = forwardRef(
  (
    { label, renderFieldButton, serverError, className, name, accept, onKeyDown, required },
    ref
  ) => {
    const {
      register,
      formState: { errors },
    } = useFormContext();
    const fieldButton = renderFieldButton();

    const { ref: inputRef, ...rest } = register(name);

    const error = errorHandler(name, {
      serverError,
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
  renderFieldButton: PropTypes.func.isRequired,
  registration: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func])),
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  accept: PropTypes.string.isRequired,
  required: PropTypes.bool,
  serverError: PropTypes.instanceOf(Error),
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
};

export default File;
