import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";

import { cn } from "../../../utils";
import getAttachment from "./get-attachment";
import { LazyImage } from "../image";

import defaultImage from "../../../assets/default-image.png";
import defaultImageLazy from "../../../assets/default-image-lazy.png";

import epubSvg from "../../../assets/epub.svg";
import pdfSvg from "../../../assets/pdf.svg";

const fallback = {
  Pdf: { image: pdfSvg, lazyImage: pdfSvg },
  Epub: { image: epubSvg, lazyImage: epubSvg },
  Image: { image: defaultImage, lazyImage: defaultImageLazy },
};

export default function MessageAttachment({ attachment, className }) {
  const { mainImage, lazyImage } = getAttachment(
    attachment,
    fallback[attachment.type] ?? fallback.Image
  );

  return (
    <div className={cn(className)}>
      <LazyImage
        className='rounded-md'
        mainImage={mainImage}
        lazyImage={lazyImage}
        variant='attachment'
        alt={attachment.id}
      />
    </div>
  );
}

MessageAttachment.propTypes = {
  className: PropTypes.string,
  attachment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    url: PropTypes.string,
    type: PropTypes.oneOf(["Image", "Epub", "Pdf"]),
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        size: PropTypes.number,
        format: PropTypes.string,
      })
    ),
  }),
};
