import { forwardRef, useEffect, type ComponentPropsWithRef, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";

import type { ValidationError } from "@/errors";

import { cn } from "@/utils";

import { useInputErrorHandler } from "@/hooks";
import { setInputRefs } from "./set-input-refs";
import { FieldWrapper } from "./field-wrapper";

export type TInputRef = HTMLInputElement;

export interface InputProps extends ComponentPropsWithRef<"input"> {
  name: string;
  testId?: string;
  label: string;
  className?: string;
  serverError: InstanceType<typeof ValidationError> | null;
  renderFieldButton?: () => ReactNode;
  showError?: boolean;
}

export const Input = forwardRef<TInputRef, InputProps>(
  (
    {
      label,
      serverError,
      type,
      name,
      onChange = () => {},
      className = "",
      autoComplete = "off",
      required = false,
      ...props
    },
    ref
  ) => {
    const {
      register,
      setError,
      formState: { errors },
    } = useFormContext();

    const { ref: inputRef, ...rest } = register(name);

    const errorMessage = errors[name]?.message?.toString();

    useInputErrorHandler(name, {
      serverError,
      setError,
    });

    return (
      <FieldWrapper
        className='sm:h-auto sm:flex-0'
        label={label}
        errorMessage={errorMessage}
        isRequired={required}
      >
        <input
          type={type}
          aria-invalid={errorMessage ? "true" : "false"}
          className={cn(
            "border-2 border-gray-900 bg-gray-950 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none",
            className
          )}
          {...rest}
          {...props}
          ref={setInputRefs(ref, inputRef)}
          onChange={(e) => {
            rest.onChange(e);
            onChange(e);
          }}
          autoComplete={autoComplete}
        />
      </FieldWrapper>
    );
  }
);

Input.displayName = "Input";
