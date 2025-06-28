import { useEffect } from "react";

export default function useClickOutside(
  ref,
  triggerRef,
  enabled,
  handler,
  events = ["mousedown", "touchstart"]
) {
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    if (!enabled) return () => controller.abort();

    const listener = (e) => {
      const paths = e.composedPath();

      if (paths.includes(triggerRef?.current)) return;
      if (!ref.current || paths.includes(ref.current)) return;

      handler();
    };

    events.forEach((event) => document.addEventListener(event, listener, { signal }));

    return () => {
      controller.abort();
    };
  }, [ref, triggerRef, enabled, handler, events]);
}
