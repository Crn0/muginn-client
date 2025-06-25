import PropTypes from "prop-types";
import { cn } from "../../../utils";
import LazyImage from "./lazy-image";

const getShape = (type) => {
  const t = type.toLowerCase();

  if (t === "user") return "rounded-xl";

  throw new Error("Invalid type");
};

export default function BackgroundAvatar({ asset, fallback, alt, size, className, type }) {
  const shapeClass = getShape(type);

  return (
    <LazyImage
      asset={asset}
      fallBackAsset={fallback}
      alt={alt}
      size={size}
      variant='backgroundAvatar'
      className={cn(shapeClass, className)}
    />
  );
}

BackgroundAvatar.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.string,
  type: PropTypes.oneOf(["user"]).isRequired,
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
  fallback: PropTypes.shape({
    image: PropTypes.string.isRequired,
    lazyImage: PropTypes.string.isRequired,
  }),
};
