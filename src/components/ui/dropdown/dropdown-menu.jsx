import PropTypes from "prop-types";
import { useRef } from "react";

import { cn } from "../../../utils";
import { useDisclosureWithClickOutside } from "../../../hooks";

export default function DropDownMenu({ id, className, renderButtonTrigger, children }) {
  const ref = useRef();
  const triggerRef = useRef();

  const disclosure = useDisclosureWithClickOutside(false, ref, triggerRef);

  const buttonTrigger = renderButtonTrigger({
    triggerRef,
    onClick: () => {
      disclosure.toggle();
      triggerRef.current?.focus?.();
    },
    ...disclosure,
  });

  return (
    <>
      {buttonTrigger}
      {disclosure.isOpen && (
        <div
          id={id}
          className={cn(
            "mt-4 grid h-[80%] max-h-90 w-2xs self-center-safe justify-self-center-safe border-2 border-gray-900 p-4",
            className
          )}
          role='menu'
          ref={ref}
        >
          {typeof children === "function" ? children() : children}
        </div>
      )}
    </>
  );
}

DropDownMenu.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  renderButtonTrigger: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
};
