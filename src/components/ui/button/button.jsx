import PropTypes from "prop-types";
import React from "react";

import { cva } from "class-variance-authority";
import { cn } from "../../../utils/index";
import { Spinner } from "../spinner/index";

const button = cva();

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
      className={cn(button({ variant, size, className }))}
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
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  testId: PropTypes.string,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
};

export default Button;
