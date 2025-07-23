import PropTypes from "prop-types";
import React from "react";

import { cva } from "class-variance-authority";
import { cn } from "../../../utils/index";

const button = cva(
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

const ButtonTab = React.forwardRef(
  ({ intent, size, testId, className, name, tab, buttonText, setTab }, ref) => (
    <button
      type='button'
      className={cn(button({ intent, size, active: name === tab }), className)}
      data-testid={testId}
      onClick={() => setTab(name)}
      ref={ref}
    >
      <span>{buttonText}</span>
    </button>
  )
);

ButtonTab.displayName = "ButtonTab";

ButtonTab.propTypes = {
  size: PropTypes.string,
  intent: PropTypes.string,
  name: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  setTab: PropTypes.func.isRequired,
  className: PropTypes.string,
  testId: PropTypes.string,
};

export default ButtonTab;
