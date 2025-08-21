import { cva } from "class-variance-authority";

import type { BaseImageProps } from "./images.types";
import type { TChatAvatar } from "@/features/chats/api";
import type { VariantPropKeys } from "@/types";

import { cn } from "@/utils";
import { getAvatar } from "./get-avatar";
import { LazyImage } from "./lazy-image";

export interface GroupChatAvatarProps
  extends BaseImageProps<TChatAvatar | null>,
    VariantPropKeys<typeof avatarVariants> {}

const avatarVariants = cva("", {
  variants: {
    variant: {
      icon: "rounded-full p-5",
      avatar: "rounded-full border-2 border-gray-900 bg-gray-950 p-5 text-center",
    },
  },
  defaultVariants: {
    variant: "icon",
  },
});

const getInitials = (alt: string) =>
  alt
    .split(/[- ]+/)
    .map((n) => n[0])
    .join(alt.includes("-") ? "-" : "");

export function GroupChatAvatar({
  asset,
  alt,
  className = "",
  variant = "icon",
}: GroupChatAvatarProps) {
  const image = getAvatar(asset, null);

  const initials = getInitials(alt ?? "");

  const mainImage = image?.mainImage;
  const lazyImage = image?.lazyImage;

  if (!mainImage && !lazyImage && variant === "avatar") {
    return (
      <div
        className={cn(
          "w-10",
          avatarVariants({ variant }),
          className,
          "border-2 border-gray-900 bg-gray-950 p-5 text-center"
        )}
      >
        {initials}
      </div>
    );
  }

  if (!mainImage && !lazyImage && variant === "icon") {
    return <div className={cn("w-10", avatarVariants({ variant }), className)}>{initials}</div>;
  }

  return (
    <div className={cn("w-10", className)}>
      <LazyImage mainImage={mainImage} lazyImage={lazyImage} variant={variant} alt={alt} />
    </div>
  );
}
