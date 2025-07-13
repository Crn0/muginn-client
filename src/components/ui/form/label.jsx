import PropTypes from "prop-types";
import { forwardRef } from "react";
import { cn } from "../../../utils";

const Label = forwardRef(({ label, isRequired, className, children, ...props }, ref) => (
  <label className={cn("grid place-content-center", className)} ref={ref} {...props}>
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
