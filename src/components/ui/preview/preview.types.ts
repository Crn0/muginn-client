import type { Image } from "@/types";

export type IAttachmentTypes = "Image" | "Pdf" | "Epub";

export interface IAttachment {
  id: string;
  url: string;
  type: IAttachmentTypes;
  images: Image[];
}
