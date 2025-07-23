import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import imageCompression from "browser-image-compression";

export default function useFilePreview(
  options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 64,
    useWebWorker: true,
    signal: null,
    maxIteration: 10,
    fileType: "",
    initialQuality: 0,
    alwaysKeepResolution: false,
  }
) {
  const prevFile = useRef(null);
  const urlsToRevoke = useMemo(() => [], []);

  const [file, setFile] = useState(null);

  const [objectUrl, setObjectUrl] = useState(null);
  const [images, setImages] = useState([]);

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

    handleCompression(file).then((res) => {
      setImages((prev) => {
        const lowResUrl = URL.createObjectURL(res);

        const image = {
          url: lowResUrl,
          size: res.size,
          type: res.type.split("/")[1],
        };

        urlsToRevoke.push(lowResUrl);

        return prev.concat(image);
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
}
