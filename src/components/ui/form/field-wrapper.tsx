import type { PropsWithChildren, ReactNode } from "react";

import { Label } from "./label";
import { ErrorMessage } from "./error-message";
import { cn } from "@/utils";

export interface FieldWrapperProps extends PropsWithChildren {
  label: ReactNode;
  className?: string;
  isRequired: boolean;
  errorMessage: string | undefined;
}

export function FieldWrapper({
  label,
  isRequired,
  errorMessage,
  children,
  className = "",
}: FieldWrapperProps) {
  return (
    <div className='flex flex-1 flex-col place-content-center items-center-safe gap-3'>
      <Label label={label} isRequired={isRequired} className={cn(className)}>
        <div className='mt-1 flex h-full w-full flex-1 items-center-safe justify-center-safe sm:items-stretch'>
          {children}
        </div>
      </Label>
      <ErrorMessage message={errorMessage} />
    </div>
  );
}
