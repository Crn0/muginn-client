import { useNavigate } from "react-router-dom";
import { RxExit } from "react-icons/rx";

import { paths } from "@/configs";
import { Authorization, policy, useGetUser } from "@/lib";
import { useLeaveGroupChat, type TGroupChat } from "../api";
import { ConfirmationDialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function LeaveGroupChat({ chat }: { chat: TGroupChat }) {
  const navigate = useNavigate();
  const { data: user } = useGetUser();

  const leaveGroupChatMutation = useLeaveGroupChat({
    onSuccess: () => navigate(paths.protected.dashboard.me.getHref(), { replace: true }),
  });

  return (
    <Authorization user={user} resource='chat' action='leave' data={chat} policy={policy}>
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
            onClick={() => leaveGroupChatMutation.mutate(chat.id)}
          >
            Leave Chat
          </Button>
        }
      />
    </Authorization>
  );
}
