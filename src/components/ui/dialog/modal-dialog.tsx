import { useRef, type PropsWithChildren, type ReactNode, type RefObject } from "react";
import { IoClose } from "react-icons/io5";

import { useDisclosureWithClickOutside } from "@/hooks";
import { Button, type TButtonRef } from "@/components/ui/button";
import { Dialog, type TDialogRef } from "./dialog";

interface ModalDialogProps extends PropsWithChildren {
  id: string;
  parentId: string;
  title: string;
  descriptions: string[];
  renderButtonTrigger: (opts: {
    triggerRef: RefObject<HTMLButtonElement>;
    onClick: () => void;
  }) => ReactNode;
}

export function ModalDialog({
  id,
  parentId,
  renderButtonTrigger,
  title,
  descriptions,
  children,
}: ModalDialogProps) {
  const dialogRef = useRef<TDialogRef>(null);
  const triggerRef = useRef<TButtonRef>(null);

  const { isOpen, toggle, close } = useDisclosureWithClickOutside(false, dialogRef, triggerRef);

  const buttonTrigger = renderButtonTrigger({
    triggerRef,
    onClick: () => {
      toggle();
      triggerRef.current?.focus?.();
    },
  });

  return (
    <Dialog
      buttonTrigger={buttonTrigger}
      ref={dialogRef}
      open={isOpen}
      id={id}
      parentId={parentId}
      className='sm:place-self-center-safe'
    >
      <div className='grid gap-5'>
        <div className='grid'>
          <div className='flex items-center justify-center'>
            <h2>{title}</h2>
            <Button
              type='button'
              className='outline hover:bg-transparent hover:text-black'
              onClick={close}
            >
              <IoClose />
            </Button>
          </div>

          {descriptions?.length > 0 && (
            <div>
              {descriptions.map((description) => (
                <div key={description} className='text-center text-xs'>
                  {description}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='flex flex-col items-center-safe justify-center-safe gap-20'>{children}</div>
      </div>
    </Dialog>
  );
}
