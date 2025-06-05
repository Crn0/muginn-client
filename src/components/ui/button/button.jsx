import PropTypes from "prop-types";
import React from "react";

import { cva } from "class-variance-authority";
import { cn } from "../../../utils/index";
import { Spinner } from "../spinner/index";

const button = cva();

const Button = React.forwardRef(
  ({ type, variant, size, testId, className, isLoading, disabled, children }, ref) => (
    <button
      type={type === "submit" ? "submit" : "button"}
      className={cn(button({ variant, size, className }))}
      disabled={disabled}
      data-testid={testId}
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
  size: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  testId: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default Button;
