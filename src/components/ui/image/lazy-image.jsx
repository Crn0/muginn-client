import PropTypes from "prop-types";
import { useState } from "react";
import { cva } from "class-variance-authority";

import { cn } from "../../../utils";

const image = cva(
  "block aspect-square h-full w-full object-cover object-center opacity-0 transition-opacity delay-150 ease-in-out",
  {
    variants: {},
    defaultVariants: {},
  }
);

export default function LazyImage({ asset, fallBackAsset, className, variant, size, alt }) {
  const [loaded, setLoaded] = useState(false);

  const sortedImages = [...(asset?.images || [])].sort((a, b) => a.size - b.size);
  const blurImage = sortedImages[0]?.url ?? fallBackAsset.lazyImage;
  const mainImage = sortedImages[sortedImages.length - 1]?.url;

  const imageContent =
    mainImage === blurImage
      ? (asset?.url ?? fallBackAsset.image)
      : (mainImage ?? fallBackAsset.image);

  return (
    <div
      className={cn("bg-cover bg-center", className)}
      style={{ backgroundImage: `url(${blurImage})` }}
    >
      <img
        className={cn(image({ variant, size }), loaded && "opacity-100")}
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
  variant: PropTypes.string,
  size: PropTypes.string,
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
