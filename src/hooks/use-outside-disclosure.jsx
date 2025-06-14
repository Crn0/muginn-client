import { useCallback, useEffect, useState } from "react";

export default function useOutsideDisclosure(initial, ref) {
  const [isOpen, setIsOpen] = useState(initial);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((state) => !state), []);

  useEffect(() => {
    const ctr = new AbortController();
    const { signal } = ctr;

    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;

      close();
    };

    document.addEventListener("mousedown", listener, { signal });
    document.addEventListener("click", listener, { signal });
    document.addEventListener("touchstart", listener, { signal });

    return () => {
      ctr.abort();
    };
  }, [close, ref]);

  return { isOpen, open, close, toggle };
}
