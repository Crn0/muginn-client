import PropTypes from "prop-types";
import { useMemo, useRef, useState } from "react";

import { cn } from "../../../utils";
import { useDisclosureWithClickOutside } from "../../../hooks";
import { DropDownMenuProvider } from "./context/dropdown-menu-context";

export default function DropDownMenu({ id, className, renderButtonTrigger, children }) {
  const ref = useRef();
  const triggerRef = useRef();

  const disclosure = useDisclosureWithClickOutside(false, ref, triggerRef);

  const [hide, setHide] = useState(false);

  const contextValue = useMemo(
    () => ({
      show: () => setHide(false),
      hide: () => setHide(true),
      reset: () => {
        setHide(false);
        disclosure.close();
      },
      ...disclosure,
    }),
    [disclosure]
  );

  const buttonTrigger = renderButtonTrigger({
    triggerRef,
    onClick: () => {
      disclosure.toggle();
      triggerRef.current?.focus?.();
    },
    ...disclosure,
  });

  return (
    <DropDownMenuProvider.Provider value={contextValue}>
      {buttonTrigger}
      {disclosure.isOpen && (
        <div
          id={id}
          className={cn(
            "mt-4 grid h-[80%] max-h-90 w-2xs self-center-safe justify-self-center-safe border-2 border-gray-900 p-4",
            `${hide ? "hidden" : ""}`,
            className
          )}
          role='menu'
          ref={ref}
        >
          {typeof children === "function" ? children() : children}
        </div>
      )}
    </DropDownMenuProvider.Provider>
  );
}

DropDownMenu.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  renderButtonTrigger: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
};
