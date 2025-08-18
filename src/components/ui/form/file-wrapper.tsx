import type { KeyboardEvent, PropsWithChildren } from "react";

import { ErrorMessage } from "./error-message";
import { cn } from "../../../utils";

export interface FileWrapperProps extends PropsWithChildren {
  label: string;
  className?: string;
  isRequired: boolean;
  errorMessage: string | undefined;
  onKeyDown: (e: KeyboardEvent<HTMLSpanElement>) => void;
}

export function FileWrapper({
  label,
  errorMessage,
  isRequired,
  children,
  onKeyDown,
  className = "",
}: FileWrapperProps) {
  return (
    <div>
      <label className={cn(isRequired ? "after:text-red-600 after:content-['*']" : "", className)}>
        <span
          role='button'
          className='rounded-sm bg-inherit p-2 text-inherit'
          onKeyDown={onKeyDown}
          tabIndex={0}
        >
          {label}
        </span>
        <div className='h-0 w-0'>{children}</div>
      </label>
      <ErrorMessage message={errorMessage} />
    </div>
  );
}
