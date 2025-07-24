import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import FileWrapper from "./file-wrapper";
import { useInputErrorHandler } from "../../../hooks";

const mergeRefs =
  (...refs) =>
  (value) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(value);
      } else {
        const clone = ref;

        clone.current = value;
      }
    });
  };

const File = forwardRef(
  (
    {
      label,
      renderFieldButton,
      serverError,
      className,
      name,
      accept,
      testId,
      onKeyDown,
      onChange,
      required,
      multiple = false,
      showError = true,
    },
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
      <div className='flex flex-col items-center-safe gap-2'>
        <FileWrapper
          label={label}
          className={className}
          error={showError ? error : null}
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
            ref={mergeRefs(ref, inputRef)}
            onBlur={required ? rest.onBlur : () => {}}
            onChange={(e) => {
              rest.onChange(e);
              onChange?.(e);
            }}
            multiple={multiple}
          />
        </FileWrapper>
        {fieldButton}
      </div>
    );
  }
);

File.displayName = "File";

File.propTypes = {
  label: PropTypes.node.isRequired,
  renderFieldButton: PropTypes.func,
  registration: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func])),
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  accept: PropTypes.string.isRequired,
  required: PropTypes.bool,
  serverError: PropTypes.instanceOf(Error),
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onChange: PropTypes.func,
  testId: PropTypes.string,
  multiple: PropTypes.bool,
  showError: PropTypes.bool,
};

export default File;
