import PropTypes from "prop-types";
import { useRef } from "react";

import { cn } from "../../../utils";
import { useDisclosureWithClickOutside } from "../../../hooks";

export default function DropDownMenu({ className, renderButtonTrigger, children }) {
  const ref = useRef();
  const triggerRef = useRef();

  const { isOpen, toggle } = useDisclosureWithClickOutside(false, ref, triggerRef);

  const buttonTrigger = renderButtonTrigger({
    triggerRef,
    onClick: () => {
      toggle();
      triggerRef.current?.focus?.();
    },
  });

  return (
    <>
      {buttonTrigger}
      {isOpen && (
        <div className={cn(className)} role='menu' ref={ref}>
          {typeof children === "function" ? children() : children}
        </div>
      )}
    </>
  );
}

DropDownMenu.propTypes = {
  className: PropTypes.string,
  renderButtonTrigger: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
};
