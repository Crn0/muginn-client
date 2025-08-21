import type { BaseImageProps } from "./images.types";
import type { TUserAvatar } from "@/lib";

import { cn } from "@/utils";

import avatarMain from "@/assets/avatar.png";
import avatarLazy from "@/assets/avatar-lazy.png";

import { getAvatar } from "./get-avatar";
import { LazyImage } from "./lazy-image";

export interface UserAvatarProps extends BaseImageProps<TUserAvatar | null> {}

const fallback = {
  main: avatarMain,
  lazy: avatarLazy,
};

export function UserAvatar({ asset, alt, className = "" }: UserAvatarProps) {
  const image = getAvatar(asset, fallback);

  return (
    <div className={cn("w-10", className)}>
      <LazyImage
        mainImage={image?.mainImage}
        lazyImage={image?.lazyImage}
        variant='avatar'
        alt={alt}
      />
    </div>
  );
}
