import { cn } from "@/utils";
import { getAttachment } from "./get-attachment";

import defaultImage from "@/assets/default-image.png";
import defaultImageLazy from "@/assets/default-image-lazy.png";
import epubSvg from "@/assets/epub.svg";
import pdfSvg from "@/assets/pdf.svg";

import { LazyImage } from "@/components/ui/image";
import type { IAttachment } from "./preview.types";

export interface MessageAttachmentProps {
  attachment: IAttachment;
  className?: string;
}

const fallback = {
  Pdf: { main: pdfSvg, lazy: pdfSvg },
  Epub: { main: epubSvg, lazy: epubSvg },
  Image: { main: defaultImage, lazy: defaultImageLazy },
} as const;

const isFallbackMapKey = (key: string): key is keyof typeof fallback =>
  typeof key === "string" && fallback.hasOwnProperty(key);

const getFallbackAsset = (type: string) =>
  isFallbackMapKey(type) ? fallback[type] : fallback.Image;

export function MessageAttachment({ attachment, className = "" }: MessageAttachmentProps) {
  const image = getAttachment(attachment, getFallbackAsset(attachment.type));

  return (
    <div className={cn(className)}>
      <LazyImage
        className='rounded-md'
        mainImage={image?.mainImage}
        lazyImage={image?.lazyImage}
        variant='attachment'
        alt={attachment.id}
      />
    </div>
  );
}
