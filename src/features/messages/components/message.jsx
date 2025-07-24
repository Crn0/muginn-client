import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";

import { NameplatePreview } from "../../../components/ui/preview";
import { formatDate } from "../../../utils";
import { DropDownMenu } from "../../../components/ui/dropdown";
import { Button } from "../../../components/ui/button";
import DeleteMessage from "./delete-message";
import MessageAttachments from "./message-attachments";

export default function Message({ message }) {
  const ref = useRef();
  const timeoutRef = useRef(null);

  const [isHover, setIsHover] = useState(false);

  const onMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsHover(true);
  };

  const onMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHover(false);
      timeoutRef.current = null;
    }, 1000);
  };

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  return (
    <div
      id={message.id}
      className='relative grid gap-2 p-5'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={ref}
    >
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
        {isHover && (
          <DropDownMenu
            id={message.id}
            className='absolute -top-50 right-25 z-50 h-100 w-50 bg-black sm:right-15'
            renderButtonTrigger={(options) => (
              <Button
                testId='drop-down-trigger'
                type='button'
                variant='outline'
                onClick={options.onClick}
                ref={options.triggerRef}
              >
                <HiDotsHorizontal />
              </Button>
            )}
          >
            <DeleteMessage message={message} />
          </DropDownMenu>
        )}
      </div>

      <div>
        <p className='ml-10'>{message.content}</p>

        <MessageAttachments attachments={message.attachments} />
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
