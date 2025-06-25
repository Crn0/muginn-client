import PropTypes from "prop-types";
import { cn } from "../../../utils";
import LazyImage from "./lazy-image";

const getShape = (type) => {
  const t = type.toLowerCase();

  if (t === "user") return "rounded-full";

  if (t === "group") return "rounded-lg";

  if (t === "direct") return "rounded-full";

  throw new Error("Invalid type");
};

const getInitials = (alt) =>
  alt
    .split(/[- ]+/)
    .map((n) => n[0])
    .join(alt.includes("-") ? "-" : "");

export default function Avatar({ asset, fallback, alt, size, className, type }) {
  const hasImage = asset?.images?.length > 0 || fallback?.image;

  const initials = getInitials(alt ?? "");

  const shapeClass = getShape(type);

  if (!hasImage) {
    return <div className={cn(shapeClass, size, className)}>{initials}</div>;
  }

  return (
    <LazyImage
      asset={asset}
      fallBackAsset={fallback}
      alt={alt}
      size={size}
      variant='avatar'
      className={cn(shapeClass, className)}
    />
  );
}

Avatar.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.string,
  type: PropTypes.oneOf(["user", "group", "direct"]).isRequired,
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
