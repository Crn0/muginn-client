import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";

import { Button } from "../../../components/ui/button";

export default function RemoveAvatar({ hasAvatar, intent, buttonText, onClick, disabled }) {
  const { setValue } = useFormContext();

  if (!hasAvatar) return null;

  return (
    <Button
      className='w-50 border border-gray-900'
      type='button'
      variant='outline'
      onClick={() => {
        setValue("intent", intent, {
          shouldDirty: true,
        });

        onClick();
      }}
      disabled={disabled}
    >
      {buttonText}
    </Button>
  );
}

RemoveAvatar.propTypes = {
  hasAvatar: PropTypes.bool.isRequired,
  intent: PropTypes.oneOf(["delete:backgroundAvatar", "delete:avatar"]),
  buttonText: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};
