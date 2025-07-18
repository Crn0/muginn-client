import PropTypes from "prop-types";
import { useRef } from "react";

import { cn } from "../../../utils";
import { useClickOutside } from "../../../hooks";

export default function Drawer({ triggerRef, className, open, onClose, children, refs = [] }) {
  const drawerRef = useRef();

  useClickOutside([...refs, drawerRef], triggerRef, open, onClose);

  return open ? (
    <div
      tabIndex='-1'
      ref={drawerRef}
      className={cn(
        "translate z-50 max-w-full -translate-x-full bg-black opacity-0 shadow-lg transition delay-75 duration-75 ease-in-out sm:hidden",
        `${open ? "flex-1 translate-0 transform opacity-100" : "hidden"}`,
        className
      )}
    >
      {children}
    </div>
  ) : null;
}

Drawer.propTypes = {
  triggerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
    .isRequired,
  refs: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.shape({ current: PropTypes.instanceOf(Element) })),
  ]),
};
