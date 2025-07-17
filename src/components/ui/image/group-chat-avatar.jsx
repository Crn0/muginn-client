import PropTypes from "prop-types";
import { cva } from "class-variance-authority";

import { cn } from "../../../utils";
import getAvatar from "./get-avatar";
import LazyImage from "./lazy-image";

// import avatarMain from "../../../assets/avatar.png";
// import avatarLazy from "../../../assets/avatar-lazy.png";

// const fallback = {
//   main: avatarMain,
//   lazy: avatarLazy,
// };

const avatar = cva("", {
  variants: {
    variant: {
      default: "rounded-full p-5",
      banner: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const getInitials = (alt) =>
  alt
    .split(/[- ]+/)
    .map((n) => n[0])
    .join(alt.includes("-") ? "-" : "");

export default function GroupChatAvatar({ asset, alt, className, variant = "default" }) {
  const { mainImage, lazyImage } = getAvatar(asset, null);

  const initials = getInitials(alt ?? "");

  if (!mainImage && !lazyImage && variant === "banner") {
    return null;
  }

  if (!mainImage && !lazyImage && variant === "default") {
    return <div className={("w-10", cn(avatar({ variant }), className))}>{initials}</div>;
  }

  return (
    <div className={cn("w-10", className)}>
      <LazyImage
        mainImage={mainImage}
        lazyImage={lazyImage}
        className={avatar({ variant })}
        alt={alt}
      />
    </div>
  );
}

GroupChatAvatar.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  variant: PropTypes.oneOf(["default", "banner"]),
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
