import type { TAsset, TFallback } from "@/types";

export const getAvatar = (asset: TAsset | null, fallback: TFallback) => {
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
