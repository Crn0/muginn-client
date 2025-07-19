import PropTypes from "prop-types";
import { FaRegTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

import { cn } from "../../../utils";
import { Button } from "../button";

import defaultImage from "../../../assets/default-image.png";

import epubSvg from "../../../assets/epub.svg";
import pdfSvg from "../../../assets/pdf.svg";

const fallbackPreview = {
  "application/pdf": pdfSvg,
  "application/epub+zip": epubSvg,
};

const getFallbackAsset = (type) => fallbackPreview[type] ?? defaultImage;

export default function FileAttachment({ attachment, className, onRemove }) {
  const [objectUrl, setObjectUrl] = useState(null);
  const fallback = getFallbackAsset(attachment.type);

  useEffect(() => {
    if (attachment instanceof File && !/epub|pdf/.test(attachment.type)) {
      const url = URL.createObjectURL(attachment);

      setObjectUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }

    return () => {};
  }, [attachment]);

  const mainImage = objectUrl ?? fallback;

  return (
    <div
      className={cn(
        "relative ml-2 grid shrink-0 basis-2/4 bg-slate-900 p-2 sm:basis-sm",
        className
      )}
    >
      <Button
        type='button'
        size='icon'
        variant='desctructive'
        className='absolute top-0 right-0 flex bg-contain bg-no-repeat'
        onClick={onRemove}
      >
        <FaRegTrashAlt color='red' />
      </Button>

      <div className='max-w-full self-center-safe'>
        <img
          className='r block aspect-square h-full w-full object-scale-down object-center'
          src={mainImage}
          alt={attachment.name}
        />
      </div>

      <div>{attachment.name}</div>
    </div>
  );
}

FileAttachment.propTypes = {
  className: PropTypes.string,
  attachment: PropTypes.instanceOf(File),
  onRemove: PropTypes.func.isRequired,
};
