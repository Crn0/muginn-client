import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import imageCompression, { type Options } from "browser-image-compression";

export const useFilePreview = (
  options: Options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 64,
    useWebWorker: true,
    signal: undefined,
    maxIteration: 10,
    fileType: "",
    initialQuality: 0,
    alwaysKeepResolution: false,
  }
) => {
  const prevFile = useRef<File | null>(null);
  const urlsToRevoke = useMemo<string[]>(() => [], []);

  const [file, setFile] = useState(null);

  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [images, setImages] = useState<{ url: string; size: number; type: string }[]>([]);

  const reset = useCallback(() => {
    prevFile.current = null;
    setFile(null);
    setObjectUrl(null);
    setImages([]);
    urlsToRevoke.forEach((_url) => URL.revokeObjectURL(_url));
    urlsToRevoke.length = 0;
  }, [urlsToRevoke]);

  const state = useMemo(
    () => ({ setFile, reset, asset: { images, url: objectUrl } }),
    [images, objectUrl, reset]
  );

  useEffect(() => {
    if (!file) return;

    if (prevFile.current === file) return;

    if (prevFile.current) {
      setObjectUrl(null);
      setImages([]);
    }

    prevFile.current = file;

    const handleCompression = async () => imageCompression(file, options);

    const url = URL.createObjectURL(file);

    urlsToRevoke.push(url);

    setObjectUrl(url);

    handleCompression().then((res) => {
      setImages((prev) => {
        const lowResUrl = URL.createObjectURL(res);

        const image = {
          url: lowResUrl,
          size: res.size,
          type: res.type.split("/")[1],
        };

        urlsToRevoke.push(lowResUrl);

        return [...prev, image];
      });
    });
  }, [file, objectUrl, options, urlsToRevoke]);

  useEffect(
    () => () => {
      reset();
    },
    [reset]
  );
  return state;
};
