import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { paths } from "../../../configs";
import { useJoinGroupChat } from "../api";
import { joinChatChatSchema } from "../schema";
import { FormDialog, Input } from "../../../components/ui/form/index";
import { Button } from "../../../components/ui/button";

export default function JoinGroupChat() {
  const navigate = useNavigate();
  const joinChatMutation = useJoinGroupChat({
    onError: (e, { chatId }) => {
      if (e.code === 409) {
        navigate(paths.protected.dashboard.groupChat.getHref({ chatId }));
      }
    },
  });

  const onSubmit =
    ({ reset }) =>
    (data) => {
      joinChatMutation.mutate(data);
      reset();
    };

  const isDone = joinChatMutation.isSuccess || joinChatMutation.error?.code === 409;

  useEffect(() => {
    if (isDone) {
      joinChatMutation.reset();
    }
  }, [isDone, joinChatMutation]);

  return (
    <FormDialog
      isCurried
      parentId='dashboard-main'
      id='Join-GroupChat-Form'
      title='Join a Group Chat'
      descriptions={["Enter an invite below to join an existing group chat"]}
      mode='onBlur'
      schema={joinChatChatSchema}
      onSubmit={onSubmit}
      done={isDone}
      renderButtonTrigger={(options) => (
        <Button
          type='button'
          testId='join-chat-form-trigger'
          onClick={options.onClick}
          ref={options.triggerRef}
        >
          Join Chat
        </Button>
      )}
      renderButtonCancel={(options) => (
        <Button type='button' testId='join-chat-form-cancel' onClick={options.onClick}>
          Cancel
        </Button>
      )}
      renderButtonSubmit={() => (
        <div>
          <Button
            type='submit'
            testId='join-chat-form-submit'
            isLoading={joinChatMutation.isPending}
            disabled={joinChatMutation.isPending}
          >
            Submit
          </Button>
        </div>
      )}
    >
      <Input
        type='text'
        name='chatId'
        label='Invite ID'
        serverError={joinChatMutation?.error}
        onChange={() => {
          if (joinChatMutation.error?.code === 404) {
            joinChatMutation.reset();
          }
        }}
        required
      />
    </FormDialog>
  );
}
