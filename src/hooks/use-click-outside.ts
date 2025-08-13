import { useEffect, type RefObject } from "react";

type EventKeys = keyof HTMLElementEventMap;

export const useClickOutside = (
  refs: RefObject<HTMLElement>[] | RefObject<HTMLElement>,
  triggerRef: RefObject<HTMLElement> | null,
  enabled: boolean,
  handler: () => void,
  events: EventKeys[] = ["mousedown", "touchstart"]
) => {
  useEffect(() => {
    if (!enabled) return () => {};

    const controller = new AbortController();
    const { signal } = controller;

    const listener = (e: Event) => {
      const paths = e.composedPath();

      if (!paths) return;

      if (triggerRef?.current && paths.includes(triggerRef?.current)) return;
      if (
        paths.some((t) => (t instanceof HTMLElement ? t.dataset?.insidePortal === "true" : false))
      )
        return;

      const refsToIgnore = Array.isArray(refs) ? refs : [refs];

      const shouldIgnore = refsToIgnore.some((ref) => ref?.current && paths.includes(ref.current));

      if (shouldIgnore) return;

      handler();
    };

    events.forEach((event) => document.addEventListener(event, listener, { signal }));

    const f = (e: Event) => {
      console.log(e);
    };

    document.addEventListener("onClick", (e) => {
      f(e);
    });

    return () => {
      controller.abort();
    };
  }, [refs, triggerRef, enabled, handler, events]);
};
