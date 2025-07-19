import PropTypes from "prop-types";
import { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";

import { MessageAttachment, NameplatePreview } from "../../../components/ui/preview";
import { formatDate } from "../../../utils";
import { DropDownMenu } from "../../../components/ui/dropdown";
import { Button } from "../../../components/ui/button";
import DeleteMessage from "./delete-message";

export default function Message({ message }) {
  const [isHover, setIsHover] = useState(false);

  const show = () => setIsHover(true);

  const hide = () => setIsHover(false);

  return (
    <div className={`${isHover ? "" : ""}`} onMouseEnter={show} onMouseLeave={hide}>
      <div>
        <NameplatePreview
          username={message.user.username}
          displayName={message.user.profile.displayName}
          asset={message.user.profile.avatar}
        />
        <time dateTime={message.createdAt}>{formatDate(message.createdAt)}</time>

        {isHover && (
          <div>
            <DropDownMenu
              id={message.id}
              renderButtonTrigger={(options) => (
                <div>
                  <Button
                    type='button'
                    testId='drop-down-trigger'
                    onClick={options.onClick}
                    ref={options.triggerRef}
                  >
                    <HiDotsHorizontal />
                  </Button>
                </div>
              )}
            >
              <DeleteMessage chatId={message.chatId} messageId={message.id} />
            </DropDownMenu>
          </div>
        )}
      </div>

      <div>
        <div>{message.content}</div>

        {message.attachments.length > 0 &&
          message.attachments.map((attachment) => (
            <MessageAttachment key={attachment.id} attachment={attachment} />
          ))}
      </div>
    </div>
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
