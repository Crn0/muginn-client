import type { ComponentPropsWithoutRef } from "react";
import type { TAsset } from "@/types";

export interface BaseImageProps extends ComponentPropsWithoutRef<"image"> {
  asset: TAsset;
  className?: string;
  alt?: string;
}
