import Proptypes from "prop-types";

import { cn } from "../../../utils";
import { MessageAttachment } from "../../../components/ui/preview";

export default function MessageAttachments({ attachments, className }) {
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

MessageAttachments.propTypes = {
  attachments: Proptypes.arrayOf(
    Proptypes.shape({
      id: Proptypes.string.isRequired,
      url: Proptypes.string.isRequired,
      type: Proptypes.oneOf(["Image", "Epub", "Pdf"]),
      images: Proptypes.arrayOf(
        Proptypes.shape({
          url: Proptypes.string.isRequired,
          size: Proptypes.number.isRequired,
          format: Proptypes.string.isRequired,
        })
      ),
    })
  ),
  className: Proptypes.string,
};
