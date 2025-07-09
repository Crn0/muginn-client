import PropTypes from "prop-types";

import { MessageAttachment, NameplatePreview } from "../../../components/ui/preview";
import { formatDate } from "../../../utils";

export default function Message({ message }) {
  return (
    <>
      <div>
        <NameplatePreview
          username={message.user.username}
          displayName={message.user.profile.displayName}
          asset={message.user.profile.avatar}
        />
        <time dateTime={message.createdAt}>{formatDate(message.createdAt)}</time>
      </div>

      <div>{message.content}</div>

      {message.attachments.length > 0 &&
        message.attachments.map((attachment) => (
          <MessageAttachment key={attachment.id} attachment={attachment} />
        ))}
    </>
  );
}

Message.propTypes = {
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
