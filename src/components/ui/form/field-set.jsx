import Proptypes from "prop-types";

import { cn } from "../../../utils";

export default function FieldSet({ className, children }) {
  return <fieldset className={cn(className)}>{children}</fieldset>;
}

FieldSet.propTypes = {
  className: Proptypes.string,
  children: Proptypes.oneOfType([Proptypes.arrayOf(Proptypes.element), Proptypes.element])
    .isRequired,
};
