import PropTypes from "prop-types";
import { useRef } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

import Dialog from "./dialog";
import { Button } from "../button";
import { useDisclosureWithClickOutside } from "../../../hooks";

export default function ModalDialog({ renderButtonTrigger, title, descriptions, children }) {
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
    <Dialog buttonTrigger={buttonTrigger} ref={dialogRef} open={isOpen}>
      <>
        <div>
          <h2>{title}</h2>
          <Button type='button' onClick={close}>
            <IoCloseCircleOutline />
          </Button>
        </div>

        {descriptions?.length > 0 && (
          <div>
            {descriptions.map((description) => (
              <div key={description}>
                <p>{description}</p>
              </div>
            ))}
          </div>
        )}

        <div>{children}</div>
      </>
    </Dialog>
  );
}

ModalDialog.propTypes = {
  renderButtonTrigger: PropTypes.func,
  title: PropTypes.string.isRequired,
  descriptions: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.element.isRequired,
};
