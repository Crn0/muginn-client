import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

import { formatDate } from "../../../utils";
import { useChat, useMyMembership } from "../../chats/api";
import { Authorization, permissions, policies } from "../../../lib";
import { useDeleteMessage } from "../api/delete-message";
import { useDropDownMenu } from "../../../components/ui/dropdown/context/dropdown-menu-context";
import { ConfirmationDialog } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { NameplatePreview } from "../../../components/ui/preview";
import { Spinner } from "../../../components/ui/spinner";
import MessageAttachments from "./message-attachments";

export default function DeleteMessage({ message }) {
  const { chatId } = useParams();

  const { data: chat } = useChat(chatId);

  const membershipQuery = useMyMembership(chat.id);
  const deleteMessage = useDeleteMessage({ chatId: message.chatId, messageId: message.id });

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
      policies={policies}
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

DeleteMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    chatId: PropTypes.string.isRequired,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    deletedAt: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      profile: PropTypes.shape({
        displayName: PropTypes.string,
        avatar: PropTypes.shape({
          url: PropTypes.string,
          images: PropTypes.arrayOf(
            PropTypes.shape({
              url: PropTypes.string,
              size: PropTypes.number,
              format: PropTypes.string,
            })
          ),
        }),
        backgroundAvatar: PropTypes.shape({
          url: PropTypes.string,
          images: PropTypes.arrayOf(
            PropTypes.shape({
              url: PropTypes.string,
              size: PropTypes.number,
              format: PropTypes.string,
            })
          ),
        }),
      }),
    }),
    replyTo: PropTypes.shape({
      id: PropTypes.string,
    }),
    attachments: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        images: PropTypes.arrayOf(
          PropTypes.shape({
            url: PropTypes.string,
            size: PropTypes.number,
            format: PropTypes.string,
          })
        ),
      })
    ),
  }),
};
