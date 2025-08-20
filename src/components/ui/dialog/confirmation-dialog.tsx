import { useRef, useEffect, type ReactNode, type RefObject } from "react";

import { useDisclosureWithClickOutside } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Dialog } from "./dialog";
import { Icon, type Iconkey } from "./icon";

export interface ConfirmationDialogProps {
  parentId: string;
  className?: string;
  title: string;
  body?: ReactNode;
  cancelButtonText?: string;
  isDone: boolean;
  icon: Iconkey;
  confirmButton: ReactNode;
  onCancel?: () => void;
  renderButtonTrigger: (opts: {
    triggerRef: RefObject<HTMLButtonElement>;
    onClick: () => void;
  }) => ReactNode;
}

export function ConfirmationDialog({
  parentId,
  renderButtonTrigger,
  confirmButton,
  title,
  isDone,
  icon,
  className = "",
  body = "",
  cancelButtonText = "cancel",
  onCancel = () => {},
}: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const { isOpen, toggle, close } = useDisclosureWithClickOutside(false, dialogRef, triggerRef);

  const buttonTrigger = renderButtonTrigger({
    triggerRef,
    onClick: () => {
      toggle();
      triggerRef.current?.focus?.();
    },
  });

  useEffect(() => {
    if (isOpen) {
      cancelRef.current?.focus?.();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isDone) {
      close();
    }
  }, [isDone, close]);
  return (
    <Dialog
      buttonTrigger={buttonTrigger}
      open={isOpen}
      ref={dialogRef}
      parentId={parentId}
      className={className}
    >
      <>
        <div className='flex items-center-safe gap-1'>
          {Icon(icon)}
          <h2>{title}</h2>
        </div>

        {typeof body === "string" ? (
          <div className='flex items-center-safe'>
            <div>
              <p>{body}</p>
            </div>
          </div>
        ) : (
          body
        )}

        <div className='flex items-center-safe justify-end-safe gap-5'>
          <Button
            type='button'
            onClick={() => {
              close();
              onCancel();
            }}
            ref={cancelRef}
            className='focus:ring-4 focus:ring-blue-500 focus:outline-none'
          >
            {cancelButtonText}
          </Button>
          {confirmButton}
        </div>
      </>
    </Dialog>
  );
}
