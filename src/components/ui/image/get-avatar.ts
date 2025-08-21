import type { TChatAvatar } from "@/features/chats/api";
import type { TUserAvatar } from "@/lib";
import type { TFallback } from "@/types";

export const getAvatar = (asset: TChatAvatar | TUserAvatar | null, fallback: TFallback) => {
  if (!asset && !fallback) {
    return;
  }

  let mainImage;

  const sortedImages = [...(asset?.images || [])].sort((a, b) => a.size - b.size);
  const lazyImage = sortedImages[0]?.url ?? fallback?.lazy;

  if (sortedImages.length <= 1) {
    mainImage = asset?.url ?? fallback?.main;
  } else {
    mainImage = sortedImages[sortedImages.length - 1]?.url;
  }

  return { mainImage, lazyImage };
};
