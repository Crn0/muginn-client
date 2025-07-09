import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";

import { cn } from "../../../utils";
import { LazyImage } from "../image";

import defaultImage from "../../../assets/default-image.png";
import defaultImageLazy from "../../../assets/default-image-lazy.png";

import epubSvg from "../../../assets/epub.svg";
import pdfSvg from "../../../assets/pdf.svg";

const fallbackPreview = {
  Pdf: { image: pdfSvg, lazyImage: pdfSvg },
  Epub: { image: epubSvg, lazyImage: epubSvg },
  Image: { image: defaultImage, lazyImage: defaultImageLazy },
};

const getFallbackAsset = (type) =>
  fallbackPreview[type] ?? { image: defaultImage, lazyImage: defaultImageLazy };

export default function MessageAttachment({ attachment, className }) {
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    if (attachment instanceof File) {
      const url = URL.createObjectURL(attachment);

      setObjectUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }

    return () => {};
  }, [attachment]);

  const asset = useMemo(
    () =>
      attachment instanceof File
        ? { url: objectUrl ?? fallbackPreview[attachment.type] }
        : attachment,
    [attachment, objectUrl]
  );

  return (
    <div className={cn(className)}>
      <LazyImage
        asset={asset}
        fallBackAsset={getFallbackAsset(attachment?.type)}
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
