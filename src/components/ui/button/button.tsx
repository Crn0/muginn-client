import React from "react";
import { cva } from "class-variance-authority";

import type { BaseButtonProps, TButtonRef } from "./button.types";
import type { VariantPropKeys } from "@/types";

import { cn } from "../../../utils";
import { Spinner } from "@/components/ui/spinner";

export interface ButtonProps extends BaseButtonProps, VariantPropKeys<typeof buttonVariants> {
  testId?: string;
  className?: string;
  isLoading?: boolean;
}

const buttonVariants = cva(
  "focus-visible:ring-ring  inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-indigo-400 text-white hover:opacity-75",
        destructive: "bg-red-500 text-white hover:opacity-75",
        outline: "bg-inherit hover:bg-transparent hover:opacity-75",
        "outline-destructive": "flex justify-between text-red-700 hover:bg-red-700/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const Button = React.forwardRef<TButtonRef, ButtonProps>(
  ({ type, variant, size, testId, children, isLoading = false, className = "", ...props }, ref) => (
    <button
      type={type === "submit" ? "submit" : "button"}
      className={cn(buttonVariants({ variant, size, className }), className)}
      data-testid={testId}
      ref={ref}
      {...props}
    >
      {(() => {
        if (isLoading) return <Spinner size='sm' className='text-current' />;

        return children;
      })()}
    </button>
  )
);

Button.displayName = "Button";
