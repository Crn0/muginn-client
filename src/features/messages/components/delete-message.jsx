import PropTypes from "prop-types";

import { useDeleteMessage } from "../api/delete-message";
import { ConfirmationDialog } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

export default function DeleteMessage({ chatId, messageId }) {
  const deleteMessage = useDeleteMessage({ chatId, messageId });

  return (
    <ConfirmationDialog
      isDone={deleteMessage.isSuccess}
      title='Delete Message'
      icon='danger'
      body='Are you sure you want to delete this message?'
      renderButtonTrigger={({ onClick }) => (
        <Button type='button' onClick={onClick}>
          Delete Message
        </Button>
      )}
      confirmButton={
        <Button type='button' onClick={() => deleteMessage.mutate({ chatId, messageId })}>
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
