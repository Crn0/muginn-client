import PropTypes from "prop-types";
import { forwardRef } from "react";
import { createPortal } from "react-dom";

import { cn } from "../../../utils";

const Dialog = forwardRef(({ parentId, id, className, open, buttonTrigger, children }, ref) => (
  <>
    {buttonTrigger}
    {open &&
      createPortal(
        <dialog
          id={id}
          data-inside-portal='true'
          className={cn(
            "focus-visible:ring-ring z-50 min-h-100 w-[100%] flex-2 gap-5 place-self-center-safe self-center-safe justify-self-center-safe border border-gray-900 bg-black p-5 text-white focus-visible:ring-4 focus-visible:ring-blue-500 sm:fixed sm:top-25 sm:w-lg",
            `${open ? "grid" : "none"}`,
            className
          )}
          ref={ref}
          open={open}
        >
          {children}
        </dialog>,
        document.getElementById(parentId)
      )}
  </>
));

Dialog.displayName = "Dialog";

Dialog.propTypes = {
  id: PropTypes.string,
  parentId: PropTypes.string.isRequired,
  className: PropTypes.string,
  buttonTrigger: PropTypes.element,
  children: PropTypes.element,
  open: PropTypes.bool.isRequired,
};

export default Dialog;
