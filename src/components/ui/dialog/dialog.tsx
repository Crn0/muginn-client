import { forwardRef, type DialogHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/utils";
import { Portal } from "@/lib";

export type TDialogRef = HTMLDialogElement;

interface DialogProps extends DialogHTMLAttributes<HTMLDialogElement> {
  parentId: string;
  id?: string;
  buttonTrigger: ReactNode;
  className?: string;
}

export const Dialog = forwardRef<TDialogRef, DialogProps>(
  ({ parentId, id, open, buttonTrigger, children, className = "" }, ref) => (
    <>
      {buttonTrigger}
      {open && (
        <Portal parentId={parentId}>
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
          </dialog>
        </Portal>
      )}
    </>
  )
);

Dialog.displayName = "Dialog";
