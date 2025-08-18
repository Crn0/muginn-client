import type { ForwardedRef, MutableRefObject } from "react";
import type { RefCallBack } from "react-hook-form";

export const setInputRefs =
  <T>(forwardedRef: ForwardedRef<T> | null, ref: MutableRefObject<T | null> | RefCallBack) =>
  (el: T) => {
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;

    if (typeof forwardedRef === "function") forwardedRef(el);
    else if (forwardedRef) forwardedRef.current = el;
  };
