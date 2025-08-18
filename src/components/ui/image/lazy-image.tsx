import { useState } from "react";
import { cva } from "class-variance-authority";

import type { VariantPropKeys } from "@/types";
import type { BaseImageProps } from "./images.types";

import { cn } from "@/utils";

export interface LazyImageProps
  extends Omit<BaseImageProps, "asset">,
    VariantPropKeys<typeof imageVariants> {
  mainImage?: string;
  lazyImage?: string;
}

const containerVariants = cva("bg-cente max-w-full bg-cover", {
  variants: {
    variant: {
      default: "rounded-none",
      attachment: "rounded-md",
      avatar: "rounded-full",
      backgroundAvatar: "rounded-md",
      icon: "",
    },
  },

  defaultVariants: {
    variant: "default",
  },
});

const imageVariants = cva(
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

export function LazyImage({
  mainImage,
  lazyImage,
  variant,
  className = "",
  alt = "",
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(containerVariants({ variant }), className)}
      style={{ backgroundImage: `url(${lazyImage})` }}
    >
      <img
        className={cn(imageVariants({ variant }), loaded ? "opacity-100" : "")}
        src={mainImage}
        alt={alt ?? ""}
        onLoad={() => setLoaded(true)}
        loading='lazy'
      />
    </div>
  );
}
