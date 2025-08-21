export type ImageFormat = "jpg" | "jpeg" | "png" | "webp" | string;

export interface Image<TImageFormat = ImageFormat> {
  url: string;
  format: TImageFormat;
  size: number;
}

export interface IAsset {
  id?: string;
  url: string;
  type: "Image" | "Pdf" | "Epub";
  images: Image[];
}

export type TAsset = IAsset | null;

export type TFallback = {
  main: string;
  lazy: string;
} | null;
