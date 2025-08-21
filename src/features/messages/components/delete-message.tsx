import type { TMessage } from "../api";

import { formatDate } from "@/utils";
import { useChat, useMyMembership } from "../../chats/api";
import { Authorization, permissions, policy } from "@/lib";
import { useDeleteMessage } from "../api/delete-message";
import { useDropDownMenu } from "@/components/ui/dropdown/context/dropdown-menu-context";
import { ConfirmationDialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NameplatePreview } from "@/components/ui/preview";
import { Spinner } from "@/components/ui/spinner";
import { MessageAttachments } from "./message-attachments";

export function DeleteMessage({ message }: { message: TMessage }) {
  const chatQuery = useChat(message.chatId);

  if (!chatQuery.isSuccess) return null;

  const chat = chatQuery.data;

  const membershipQuery = useMyMembership(chat.id);
  const deleteMessage = useDeleteMessage(chat.id);

  const { hide, reset } = useDropDownMenu();

  if (membershipQuery.isLoading && !membershipQuery.data) {
    return (
      <div className='row-span-3 flex items-center-safe justify-center-safe'>
        <Spinner />
      </div>
    );
  }

  return (
    <Authorization
      policy={policy}
      user={membershipQuery.data}
      resource='message'
      action='delete'
      data={message}
      environment={{ chat, permissions: permissions.message.delete }}
    >
      <ConfirmationDialog
        parentId={message.id}
        isDone={deleteMessage.isSuccess}
        className='fixed top-50'
        title='Delete Message'
        icon='danger'
        body={
          <div className='grid gap-2 border-2 border-slate-900 p-2'>
            <div className='flex items-center-safe justify-between'>
              <div className='flex items-center-safe gap-2'>
                <NameplatePreview
                  username={message.user.username}
                  displayName={message.user.profile.displayName}
                  asset={message.user.profile.avatar}
                />
                <time className='text-xs font-light' dateTime={message.createdAt}>
                  {formatDate(message.createdAt)}
                </time>
              </div>
            </div>

            <div>
              <p className='w-50 overflow-hidden overflow-ellipsis whitespace-nowrap sm:w-100'>
                {message.content}
              </p>

              <MessageAttachments attachments={message.attachments} className='w-50 sm:w-sm' />
            </div>
          </div>
        }
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
            onClick={() => deleteMessage.mutate({ chatId: message.chatId, messageId: message.id })}
          >
            Delete
          </Button>
        }
      />
    </Authorization>
  );
}
