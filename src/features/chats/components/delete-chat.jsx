import { useNavigate, useParams } from "react-router-dom";

import { paths } from "../../../configs";
import { useDeleteChat } from "../api";
import { ConfirmationDialog } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

export default function DeleteChat() {
  const navigate = useNavigate();

  const { chatId } = useParams();

  const deleteChat = useDeleteChat(chatId, {
    onSuccess: () => {
      navigate(paths.protected.dashboard.me.getHref({ redirectTo: null }), { replace: true });
    },
  });

  return (
    <ConfirmationDialog
      parentId='chat-settings'
      isDone={deleteChat.isSuccess}
      className='fixed top-50'
      title='Delete Group Chat'
      icon='danger'
      body='Are you sure you want to delete this chat?'
      renderButtonTrigger={({ onClick }) => (
        <Button type='button' variant='outline-destructive' onClick={onClick}>
          Delete Chat
        </Button>
      )}
      confirmButton={
        <Button type='button' variant='destructive' onClick={deleteChat.mutate}>
          Delete
        </Button>
      }
    />
  );
}
