import { useCallback, useEffect, useState } from "react";

export default function useOutsideDisclosure(initial, ref, triggerRef) {
  const [isOpen, setIsOpen] = useState(initial);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((state) => !state), []);

  useEffect(() => {
    const ctr = new AbortController();
    const { signal } = ctr;

    const listener = (e) => {
      if (triggerRef?.current === e.target) return;
      if (!ref.current || ref.current.contains(e.target)) return;

      close();
    };

    document.addEventListener("mousedown", listener, { signal });
    document.addEventListener("touchstart", listener, { signal });

    return () => {
      ctr.abort();
    };
  }, [close, ref, triggerRef]);

  return { isOpen, open, close, toggle };
}
