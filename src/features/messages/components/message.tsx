import { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";

import type { TMessage } from "../api";

import { formatDate } from "@/utils";
import { NameplatePreview } from "@/components/ui/preview";
import { DropDownMenu } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { DeleteMessage } from "./delete-message";
import { MessageAttachments } from "./message-attachments";

export function Message({ message }: { message: TMessage }) {
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
            className='fixed top-45 right-15 z-50 min-h-9/12 w-50 overflow-hidden bg-black sm:top-50 sm:right-15'
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
        <p className='break-all whitespace-pre-wrap'>{message.content}</p>

        <MessageAttachments attachments={message.attachments} />
      </div>
    </div>
  );
}
