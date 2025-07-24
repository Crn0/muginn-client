import PropTypes from "prop-types";
import { useRef, useEffect } from "react";
import { CgDanger } from "react-icons/cg";
import { FaExclamation } from "react-icons/fa";

import { useDisclosureWithClickOutside } from "../../../hooks";
import Dialog from "./dialog";
import { Button } from "../button";

function Icon(type) {
  const icon = {
    danger: <CgDanger color='red' aria-hidden='true' />,
    info: <FaExclamation aria-hidden='true' />,
  };

  return icon[type] ?? null;
}

export default function ConfirmationDialog({
  parentId,
  renderButtonTrigger,
  confirmButton,
  title,
  isDone,
  icon,
  body = "",
  cancelButtonText = "cancel",
  onCancel = () => {},
}) {
  const dialogRef = useRef();
  const triggerRef = useRef();
  const cancelRef = useRef();

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
    <Dialog buttonTrigger={buttonTrigger} open={isOpen} ref={dialogRef} parentId={parentId}>
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

ConfirmationDialog.propTypes = {
  parentId: PropTypes.string.isRequired,
  confirmButton: PropTypes.element,
  renderButtonTrigger: PropTypes.func,
  title: PropTypes.string.isRequired,
  body: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  cancelButtonText: PropTypes.node,
  isDone: PropTypes.bool.isRequired,
  icon: PropTypes.oneOf(["danger", "info"]),
  onCancel: PropTypes.func,
};
