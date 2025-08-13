import { useDisclosure } from "./use-disclosure";
import { useClickOutside } from "./use-click-outside";
import type { RefObject } from "react";

export const useDisclosureWithClickOutside = (
  initial: boolean,
  ref: RefObject<HTMLElement>,
  triggerRef: RefObject<HTMLElement> | null
) => {
  const disclosure = useDisclosure(initial);

  useClickOutside(ref, triggerRef, disclosure.isOpen, disclosure.close);

  return disclosure;
};
