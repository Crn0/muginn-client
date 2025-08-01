import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import { cva } from "class-variance-authority";

import { cn } from "../../../utils";
import FieldWrapper from "./field-wrapper";
import { useInputErrorHandler } from "../../../hooks";

const textarea = cva("flex-1", {
  variants: {
    variant: {
      default: "border-2 border-black bg-white",
      message: "resize-none border-none shadow-none outline-none",
      aboutMe: "resize-none border-2 border-gray-900 bg-gray-950",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const TextArea = forwardRef(
  (
    {
      serverError,
      className,
      variant,
      name,
      maxLength,
      required,
      label = "",
      onChange = () => {},
      ...props
    },
    ref
  ) => {
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
      <FieldWrapper label={label} className={cn(className)} error={error} isRequired={required}>
        <textarea
          name={name}
          className={textarea({ variant })}
          maxLength={maxLength}
          aria-invalid={error?.message ? "true" : "false"}
          ref={ref}
          {...rest}
          onChange={(e) => {
            onChange(e);
            rest.onChange(e);
          }}
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
  variant: PropTypes.oneOf(["message", "aboutMe", "default"]),
  onChange: PropTypes.func,
};

export default TextArea;
