import { forwardRef, type ComponentPropsWithRef, type ReactNode, type KeyboardEvent } from "react";

import type { ValidationError } from "@/errors";

import { useFormContext, type FieldError } from "react-hook-form";
import { FileWrapper } from "./file-wrapper";
import { setInputRefs } from "./set-input-refs";
import { useInputErrorHandler } from "@/hooks";

export type TFileRef = HTMLInputElement;

export interface FileProps extends ComponentPropsWithRef<"input"> {
  name: string;
  testId: string;
  label: string;
  className?: string;
  serverError: InstanceType<typeof ValidationError> | null;
  renderFieldButton?: () => ReactNode;
  showError?: boolean;
  pressKey: (e: KeyboardEvent<HTMLSpanElement>) => void;
}

export const File = forwardRef<TFileRef, FileProps>(
  (
    {
      label,
      renderFieldButton,
      serverError,
      className,
      name,
      accept,
      testId,
      pressKey,
      onChange,
      multiple = false,
      showError = false,
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
    const fieldButton = typeof renderFieldButton === "function" ? renderFieldButton() : null;

    const { ref: inputRef, ...rest } = register(name);

    useInputErrorHandler(name, {
      serverError,
      setError,
    });

    const errorMessage = showError ? errors[name]?.message?.toString() : undefined;

    return (
      <div className='flex flex-col items-center-safe gap-2'>
        <FileWrapper
          label={label}
          className={className}
          errorMessage={errorMessage}
          onKeyDown={pressKey}
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
            ref={setInputRefs(ref, inputRef)}
            onBlur={required ? rest.onBlur : () => {}}
            onChange={(e) => {
              rest.onChange(e);
              onChange?.(e);
            }}
            multiple={multiple}
            {...props}
          />
        </FileWrapper>
        {fieldButton}
      </div>
    );
  }
);

File.displayName = "File";
