import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
} from "react";

import { cn } from "@/utils";
import { useDisclosureWithClickOutside, type TDisclosure } from "@/hooks";
import { DropDownMenuProvider } from "./context/dropdown-menu-context";

export interface DropDownMenuProps extends PropsWithChildren {
  id: string;
  className: string;
  renderButtonTrigger: (
    opts: {
      triggerRef: RefObject<HTMLButtonElement>;
      onClick: () => void;
    } & TDisclosure
  ) => ReactNode;
}

export function DropDownMenu({
  id,
  renderButtonTrigger,
  children,
  className = "",
}: DropDownMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const disclosure = useDisclosureWithClickOutside(false, ref, triggerRef);

  const [hide, setHide] = useState(false);

  const contextValue = useMemo(
    () => ({
      show: () => setHide(false),
      hide: () => setHide(true),
      toggleVisibility: () => setHide((state) => !state),
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

  useEffect(() => {
    if (!disclosure.isOpen) {
      setHide(false);
    }
  }, [disclosure.isOpen]);

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
          {children}
        </div>
      )}
    </DropDownMenuProvider.Provider>
  );
}
