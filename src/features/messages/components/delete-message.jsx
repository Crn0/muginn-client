import PropTypes from "prop-types";

import { useDeleteMessage } from "../api/delete-message";
import { useDropDownMenu } from "../../../components/ui/dropdown/context/dropdown-menu-context";
import { ConfirmationDialog } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

export default function DeleteMessage({ chatId, messageId }) {
  const deleteMessage = useDeleteMessage({ chatId, messageId });
  const { hide, reset } = useDropDownMenu();

  return (
    <ConfirmationDialog
      parentId={messageId}
      isDone={deleteMessage.isSuccess}
      title='Delete Message'
      icon='danger'
      body='Are you sure you want to delete this message?'
      onCancel={reset}
      renderButtonTrigger={({ onClick }) => (
        <Button
          type='button'
          variant='outline-destructive'
          onClick={() => {
            onClick();
            hide();
          }}
        >
          Delete Message
        </Button>
      )}
      confirmButton={
        <Button
          type='button'
          variant='destructive'
          onClick={() => deleteMessage.mutate({ chatId, messageId })}
        >
          Delete
        </Button>
      }
    />
  );
}

DeleteMessage.propTypes = {
  chatId: PropTypes.string.isRequired,
  messageId: PropTypes.string.isRequired,
};
