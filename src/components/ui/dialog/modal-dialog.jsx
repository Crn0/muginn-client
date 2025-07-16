import PropTypes from "prop-types";
import { useRef } from "react";
import { IoClose } from "react-icons/io5";

import Dialog from "./dialog";
import { Button } from "../button";
import { useDisclosureWithClickOutside } from "../../../hooks";

export default function ModalDialog({
  id,
  parentId,
  renderButtonTrigger,
  title,
  descriptions,
  children,
}) {
  const dialogRef = useRef();
  const triggerRef = useRef();

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
              variant='outline hover:bg-transparent hover:text-black'
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

ModalDialog.propTypes = {
  id: PropTypes.string,
  parentId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  renderButtonTrigger: PropTypes.func,
  descriptions: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.element.isRequired,
};
