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

  return icon[type];
}

export default function ConfirmationDialog({
  parentId,
  renderButtonTrigger,
  confirmButton,
  title,
  isDone,
  body = "",
  icon = "info",
  cancelButtonText = "cancel",
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

  useEffect(() => {
    if (isDone) {
      close();
    }
  }, [isDone, close]);
  return (
    <Dialog buttonTrigger={buttonTrigger} open={isOpen} ref={dialogRef} parentId={parentId}>
      <>
        <div>
          <h2>
            {Icon(icon)}
            {title}
          </h2>
        </div>

        <div>
          {body && (
            <div>
              <p>{body}</p>
            </div>
          )}
        </div>

        <div>
          {confirmButton}
          <Button type='button' onClick={() => close()}>
            {cancelButtonText}
          </Button>
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
  body: PropTypes.string,
  cancelButtonText: PropTypes.node,
  isDone: PropTypes.bool.isRequired,
  icon: PropTypes.oneOf(["danger", "info"]),
};
