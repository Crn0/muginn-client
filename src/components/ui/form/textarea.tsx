import {
  forwardRef,
  type ComponentPropsWithRef,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { useFormContext, type FieldError } from "react-hook-form";
import { cva } from "class-variance-authority";

import type { VariantPropKeys } from "@/types";
import type { ValidationError } from "@/errors";

import { cn } from "@/utils";

import { useInputErrorHandler } from "@/hooks";
import { setInputRefs } from "./set-input-refs";
import { FieldWrapper } from "./field-wrapper";

export type TTextAreaRef = HTMLTextAreaElement;

export interface TextAreaProps
  extends PropsWithChildren,
    ComponentPropsWithRef<"textarea">,
    VariantPropKeys<typeof textareaVariants> {
  name: string;
  label: ReactNode;
  className?: string;
  serverError: InstanceType<typeof ValidationError> | null;
}

const textareaVariants = cva("flex-1", {
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

export const TextArea = forwardRef<TTextAreaRef, TextAreaProps>(
  (
    {
      serverError,
      variant,
      name,
      maxLength,
      label,
      required = false,
      className = "",
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

    const { ref: inputRef, ...rest } = register(name);

    const errorMessage = errors[name]?.message?.toString();

    useInputErrorHandler(name, {
      serverError,
      setError,
    });

    return (
      <FieldWrapper
        label={label}
        className={className}
        errorMessage={errorMessage}
        isRequired={required}
      >
        <textarea
          className={textareaVariants({ variant })}
          maxLength={maxLength}
          aria-invalid={errorMessage ? "true" : "false"}
          {...rest}
          ref={setInputRefs(ref, inputRef)}
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
