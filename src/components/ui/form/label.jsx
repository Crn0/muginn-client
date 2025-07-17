import PropTypes from "prop-types";
import { forwardRef } from "react";
import { cn } from "../../../utils";

const Label = forwardRef(({ label, isRequired, className, children, ...props }, ref) => (
  <label
    className={cn("flex flex-1 flex-col items-center-safe justify-center-safe", className)}
    ref={ref}
    {...props}
  >
    <span className={`${isRequired ? "after:text-red-600 after:content-['*']" : ""}`}>{label}</span>
    {children}
  </label>
));

Label.displayName = Label;

Label.propTypes = {
  label: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.element,
  isRequired: PropTypes.bool,
};

export default Label;
