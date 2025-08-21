import type { ComponentPropsWithoutRef } from "react";
import type { TAsset } from "@/types";

export interface BaseImageProps<Asset = TAsset> extends ComponentPropsWithoutRef<"image"> {
  asset: Asset;
  className?: string;
  alt?: string;
}
