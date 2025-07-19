import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { RxExit } from "react-icons/rx";

import { paths } from "../../../configs";
import { useLeaveGroupChat } from "../api";
import { ConfirmationDialog } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

export default function LeaveGroupChat({ chat }) {
  const navigate = useNavigate();

  const leaveGroupChatMutation = useLeaveGroupChat({
    onSuccess: () => navigate(paths.protected.dashboard.me.getHref(), { replace: true }),
  });

  return (
    <ConfirmationDialog
      parentId='group-chat-view-dropdown'
      isDone={leaveGroupChatMutation.isSuccess}
      title={`Leave '${chat.name}'`}
      icon='danger'
      body={`Are you sure you want to leave ${chat.name}? You won't be able to rejoin this chat unless you are re-invited.`}
      cancelButtonText='Cancel'
      renderButtonTrigger={({ onClick }) => (
        <Button
          type='button'
          onClick={onClick}
          variant='outline'
          className='flex justify-between text-red-700 hover:bg-red-700/20'
        >
          <span>Leave Chat</span>
          <span>
            <RxExit color='red' />
          </span>
        </Button>
      )}
      confirmButton={
        <Button
          type='button'
          variant='destructive'
          onClick={() => leaveGroupChatMutation.mutate({ id: chat.id })}
        >
          Leave Chat
        </Button>
      }
    />
  );
}

LeaveGroupChat.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["GroupChat"]),
  }).isRequired,
};
