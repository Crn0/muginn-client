import PropTypes from "prop-types";
import React from "react";

import { cva } from "class-variance-authority";
import { cn } from "../../../utils/index";
import { Spinner } from "../spinner/index";

const button = cva(
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

const Button = React.forwardRef(
  (
    {
      type,
      variant,
      size,
      testId,
      className,
      isLoading,
      disabled,
      children,
      tabIndex = 0,
      onClick = () => {},
    },
    ref
  ) => (
    <button
      type={type === "submit" ? "submit" : "button"}
      className={cn(button({ variant, size, className }), className)}
      tabIndex={tabIndex}
      disabled={disabled}
      data-testid={testId}
      onClick={onClick}
      ref={ref}
    >
      {(() => {
        if (isLoading) return <Spinner size='sm' className='text-current' />;

        return children;
      })()}
    </button>
  )
);

Button.displayName = "Button";

Button.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.string,
  variant: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  testId: PropTypes.string,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
};

export default Button;
