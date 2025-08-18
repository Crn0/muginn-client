import { useRef, type PropsWithChildren, type RefObject } from "react";

import { cn } from "@/utils";
import { useClickOutside } from "@/hooks";

export interface DrawerProps extends PropsWithChildren {
  className?: string;
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement>;
  refs: RefObject<HTMLElement>[];
}

export function Drawer({
  open,
  onClose,
  triggerRef,
  children,
  className = "",
  refs = [],
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useClickOutside([...refs, drawerRef], triggerRef, open, onClose);

  return open ? (
    <div
      tabIndex={-1}
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
