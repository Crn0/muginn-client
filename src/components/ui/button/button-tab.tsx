import { forwardRef, type Dispatch, type SetStateAction } from "react";

import type { BaseButtonProps, TButtonRef } from "./button.types";
import type { VariantPropKeys } from "@/types";

import { cva } from "class-variance-authority";
import { cn } from "@/utils";

export interface ButtonTabProps extends BaseButtonProps, VariantPropKeys<typeof buttonVariants> {
  name: string;
  tab: string;
  testId: string;
  setTab: Dispatch<SetStateAction<string>>;
  className?: string;
}

const buttonVariants = cva(
  "bg-inherit focus-visible:ring-ring inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      intent: {
        primary: "hover:bg-gray-500/50 font-light hover:font-bold",
        secondary: "font-light hover:font-bold hover:border-b-5 hover:border-indigo-500",
      },
      active: {
        false: null,
        true: "bg-gray-500/50 font-light font-bold",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "size-9",
      },
    },
    compoundVariants: [
      {
        intent: "secondary",
        active: true,
        class: "border-b-5 border-indigo-500 text-indigo-500 bg-inherit",
      },
    ],

    defaultVariants: {
      intent: "primary",
      size: "default",
      active: false,
    },
  }
);

export const ButtonTab = forwardRef<TButtonRef, ButtonTabProps>(
  ({ intent, size, testId, name, tab, setTab, children, className = "", ...props }, ref) => (
    <button
      type='button'
      className={cn(buttonVariants({ intent, size, active: name === tab }), className)}
      data-testid={testId}
      onClick={() => setTab(name)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
);

ButtonTab.displayName = "ButtonTab";
