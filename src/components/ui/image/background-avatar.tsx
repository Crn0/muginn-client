import type { BaseImageProps } from "./images.types";
import type { TUserAvatar } from "@/lib";

import { cn } from "@/utils";
import avatarMain from "@/assets/avatar.png";
import avatarLazy from "@/assets/avatar-lazy.png";

import { getAvatar } from "./get-avatar";
import { LazyImage } from "./lazy-image";

const fallback = {
  main: avatarMain,
  lazy: avatarLazy,
};

export interface BackgroundAvatarProps extends BaseImageProps<TUserAvatar | null> {}

export function BackgroundAvatar({ asset, alt, className = "" }: BackgroundAvatarProps) {
  const image = getAvatar(asset, fallback);

  return (
    <div className={cn("flex-1", className)}>
      <LazyImage
        mainImage={image?.mainImage}
        lazyImage={image?.lazyImage}
        alt={alt}
        variant='backgroundAvatar'
      />
    </div>
  );
}
