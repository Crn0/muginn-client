import PropTypes from "prop-types";
import { cva } from "class-variance-authority";

import { cn } from "../../../utils";
import getAvatar from "./get-avatar";
import LazyImage from "./lazy-image";

const avatar = cva("", {
  variants: {
    variant: {
      icon: "rounded-full p-5",
      avatar: "rounded-full",
    },
  },
  defaultVariants: {
    variant: "icon",
  },
});

const getInitials = (alt) =>
  alt
    .split(/[- ]+/)
    .map((n) => n[0])
    .join(alt.includes("-") ? "-" : "");

export default function GroupChatAvatar({ asset, alt, className, variant = "icon" }) {
  const { mainImage, lazyImage } = getAvatar(asset);

  const initials = getInitials(alt ?? "");

  if (!mainImage && !lazyImage && variant === "avatar") {
    return null;
  }

  if (!mainImage && !lazyImage && variant === "icon") {
    return <div className={("w-10", cn(avatar({ variant }), className))}>{initials}</div>;
  }

  return (
    <div className={cn("w-10", className)}>
      <LazyImage mainImage={mainImage} lazyImage={lazyImage} variant={variant} alt={alt} />
    </div>
  );
}

GroupChatAvatar.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  variant: PropTypes.oneOf(["icon", "avatar"]),
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
