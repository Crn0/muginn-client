import PropTypes from "prop-types";
import { cva } from "class-variance-authority";

import type { ComponentPropsWithRef } from "react";
import type { VariantPropKeys } from "@/types";

import { cn } from "../../../utils/index";

export interface AnchorProps
  extends ComponentPropsWithRef<"a">,
    VariantPropKeys<typeof anchorVariants> {
  testId?: string;
  className?: string;
  to: string;
}

const anchorVariants = cva(
  "focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:outline-none",
  {
    variants: {
      variant: {
        default: "text-blue-500 hover:opacity-75",

        button:
          "inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors",
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

export function Anchor({
  to,
  children,
  style,
  variant,
  size,
  className = "",
  hrefLang = "",
  testId = "",
}: AnchorProps) {
  return (
    <a
      hrefLang={hrefLang}
      data-testid={testId}
      href={to}
      className={cn(className, anchorVariants({ variant, size }))}
      style={style}
    >
      {children}
    </a>
  );
}

Anchor.propTypes = {
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  size: PropTypes.string,
  hrefLang: PropTypes.string,
  testId: PropTypes.string,
};
