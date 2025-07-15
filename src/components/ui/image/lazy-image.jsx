import PropTypes from "prop-types";
import { useState } from "react";

import { cn } from "../../../utils";

export default function LazyImage({ asset, fallBackAsset, className, alt }) {
  const [loaded, setLoaded] = useState(false);

  const sortedImages = [...(asset?.images || [])].sort((a, b) => a.size - b.size);
  const blurImage = sortedImages[0]?.url ?? fallBackAsset.lazyImage;
  const mainImage = sortedImages[sortedImages.length - 1]?.url ?? asset?.url;

  const imageContent =
    mainImage === blurImage
      ? (asset?.url ?? fallBackAsset.image)
      : (mainImage ?? fallBackAsset.image);

  return (
    <div
      className={cn("max-w-full bg-cover bg-center", className)}
      style={{ backgroundImage: `url(${blurImage})` }}
    >
      <img
        className={cn(
          "block aspect-square h-full w-full object-cover object-center opacity-0 transition-opacity delay-150 ease-in-out",
          loaded && "opacity-100"
        )}
        src={imageContent}
        alt={alt ?? ""}
        onLoad={() => setLoaded(true)}
        loading='lazy'
      />
    </div>
  );
}

LazyImage.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  asset: PropTypes.shape({
    url: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        size: PropTypes.number,
        format: PropTypes.string,
      })
    ),
  }),
  fallBackAsset: PropTypes.shape({
    image: PropTypes.string.isRequired,
    lazyImage: PropTypes.string.isRequired,
  }),
};
