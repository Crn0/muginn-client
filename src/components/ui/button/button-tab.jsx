import PropTypes from "prop-types";
import React from "react";

import { cva } from "class-variance-authority";
import { cn } from "../../../utils/index";

const button = cva();

const ButtonTab = React.forwardRef(
  ({ variant, size, testId, className, name, tab, buttonText, setTab }, ref) => (
    <button
      type='button'
      className={cn(
        button({ variant, size, active: name === tab }),
        className,
        `${name === tab ? "foo" : "bar"}`
      )}
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
  variant: PropTypes.string,
  name: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  setTab: PropTypes.func.isRequired,
  className: PropTypes.string,
  testId: PropTypes.string,
};

export default ButtonTab;
