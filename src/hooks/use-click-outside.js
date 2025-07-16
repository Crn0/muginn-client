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

      if (!ref.current || paths.includes(ref.current)) return;
      if (paths.includes(triggerRef?.current)) return;
      if (paths.some(({ dataset }) => dataset?.insidePortal === "true")) return;

      handler();
    };

    events.forEach((event) => document.addEventListener(event, listener, { signal }));

    return () => {
      controller.abort();
    };
  }, [ref, triggerRef, enabled, handler, events]);
}
