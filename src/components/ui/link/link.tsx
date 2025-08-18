import { Link as RouterLink, type LinkProps as LP } from "react-router-dom";

import type { VariantPropKeys } from "@/types";

import { cva } from "class-variance-authority";
import { cn } from "@/utils/index";

export interface LinkProps extends LP, VariantPropKeys<typeof linkVariants> {
  testId?: string;
  className?: string;
}

const linkVariants = cva(
  "text-sm font-medium whitespace-nowrap text-blue-500 transition-colors hover:opacity-75 focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:outline-none",
  {
    variants: {
      variant: {
        default: "text-blue-500 hover:opacity-75",
        button:
          "inline-flex items-center justify-center rounded-md bg-indigo-400 p-5 text-center text-sm font-medium whitespace-nowrap text-white no-underline transition-colors hover:opacity-75",
        outline:
          "focus-visible:ring-ring inline-flex items-center justify-center text-inherit rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50      bg-inherit hover:bg-transparent hover:opacity-75",
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

export function Link({
  to,
  children,
  variant,
  size,
  testId = "",
  className = "",
  ...props
}: LinkProps) {
  return (
    <RouterLink
      hrefLang=''
      to={to}
      data-testid={testId}
      onClick={props?.onClick ? props.onClick : () => {}}
      className={cn(linkVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </RouterLink>
  );
}
