import PropTypes from "prop-types";
import { forwardRef } from "react";

import { cn } from "../../../utils";

const Dialog = forwardRef(({ className, open, buttonTrigger, children }, ref) => (
  <>
    {buttonTrigger}
    <dialog className={cn(className)} ref={ref} open={open}>
      {children}
    </dialog>
  </>
));

Dialog.displayName = "Dialog";

Dialog.propTypes = {
  className: PropTypes.string,
  buttonTrigger: PropTypes.element,
  children: PropTypes.element,
  open: PropTypes.bool.isRequired,
};

export default Dialog;
