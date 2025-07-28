import PropTypes from "prop-types";
import { useState } from "react";
import { cva } from "class-variance-authority";

import { cn } from "../../../utils";

const container = cva("bg-cente max-w-full bg-cover", {
  variants: {
    variant: {
      default: "rounded-none",
      attachment: "rounded-md",
      avatar: "rounded-full",
      backgroundAvatar: "rounded-md",
    },
  },

  defaultVariants: {
    variant: "default",
  },
});

const image = cva(
  "block aspect-square h-full w-full object-cover object-center opacity-0 transition-opacity delay-150 ease-in-out",
  {
    variants: {
      variant: {
        default: "rounded-none",
        attachment: "rounded-md",
        avatar: "rounded-full",
        backgroundAvatar: "object-fill h-50 sm:h-100 rounded-md",
        icon: "rounded-full p-5",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);

export default function LazyImage({ mainImage, lazyImage, className, variant, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(container({ variant }), className)}
      style={{ backgroundImage: `url(${lazyImage})` }}
    >
      <img
        className={cn(image({ variant }), loaded && "opacity-100")}
        src={mainImage}
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
  mainImage: PropTypes.string.isRequired,
  lazyImage: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["default", "attachment", "avatar", "backgroundAvatar", "icon"]),
};
