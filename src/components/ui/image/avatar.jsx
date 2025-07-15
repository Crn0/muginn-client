import PropTypes from "prop-types";

import { cva } from "class-variance-authority";
import { cn } from "../../../utils";
import LazyImage from "./lazy-image";

const avatar = cva("", {
  variants: {
    variant: {
      user: "rounded-full p-5",
      group: {},
    },
    size: {},
  },
});

const getInitials = (alt) =>
  alt
    .split(/[- ]+/)
    .map((n) => n[0])
    .join(alt.includes("-") ? "-" : "");

export default function Avatar({ asset, fallback, alt, className, variant }) {
  const hasImage = asset?.images?.length > 0 || fallback?.image;

  const initials = getInitials(alt ?? "");

  if (!hasImage && variant === "group") {
    return <div className={cn(className, avatar({ variant }))}>{initials}</div>;
  }

  return (
    <div className='w-10'>
      <LazyImage
        asset={asset}
        fallBackAsset={fallback}
        className={cn(className, avatar({ variant }))}
        alt={alt}
      />
    </div>
  );
}

Avatar.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  variant: PropTypes.oneOf(["user", "group"]),
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
