import { useEffect } from "react";

export default function useClickOutside(
  refs,
  triggerRef,
  enabled,
  handler,
  events = ["mousedown", "touchstart"]
) {
  useEffect(() => {
    if (!enabled) return () => {};

    const controller = new AbortController();
    const { signal } = controller;

    const listener = (e) => {
      const paths = e.composedPath();

      if (paths.includes(triggerRef?.current)) return;
      if (paths.some(({ dataset }) => dataset?.insidePortal === "true")) return;

      const refsToIgnore = Array.isArray(refs) ? refs : [refs];

      const shouldIgnore = refsToIgnore.some((ref) => paths.includes(ref?.current));

      if (shouldIgnore) return;

      handler();
    };

    events.forEach((event) => document.addEventListener(event, listener, { signal }));

    return () => {
      controller.abort();
    };
  }, [refs, triggerRef, enabled, handler, events]);
}
