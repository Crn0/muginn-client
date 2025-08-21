import type { TMessage } from "../api";

import { cn } from "@/utils";
import { MessageAttachment } from "@/components/ui/preview";

export interface MessageAttachmentsProps {
  attachments: Pick<TMessage, "attachments">["attachments"];
  className?: string;
}

export function MessageAttachments({ attachments, className = "" }: MessageAttachmentsProps) {
  if (attachments.length <= 0) return null;

  return (
    <div className={cn("flex w-auto flex-wrap gap-1 sm:w-lg", className)}>
      {attachments.map((attachment, i) => (
        <MessageAttachment
          key={attachment.id}
          attachment={attachment}
          className={cn("shrink-0 grow-1", `${i <= 1 ? "basis-[45%]" : "basis-[25%]"}`)}
        />
      ))}
    </div>
  );
}
