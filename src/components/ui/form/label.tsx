import { forwardRef, type ComponentPropsWithRef, type ReactNode } from "react";

import { cn } from "@/utils";

export type TLabelRef = HTMLLabelElement;

export interface LabelProps extends ComponentPropsWithRef<"label"> {
  testId?: string;
  label: ReactNode;
  className?: string;
  isRequired?: boolean;
}

export const Label = forwardRef<TLabelRef, LabelProps>(
  ({ testId, label, children, isRequired = false, className = "", ...props }, ref) => (
    <label
      className={cn("flex flex-1 flex-col items-center-safe justify-center-safe", className)}
      ref={ref}
      {...props}
    >
      <span className={`${isRequired ? "after:text-red-600 after:content-['*']" : ""}`}>
        {label}
      </span>
      {children}
    </label>
  )
);

Label.displayName = "Label";
