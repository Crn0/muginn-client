import useDisclosure from "./use-disclosure";
import useClickOutside from "./use-click-outside";

export default function useDisclosureWithClickOutside(initial, ref, triggerRef) {
  const disclosure = useDisclosure(initial);

  useClickOutside(ref, triggerRef, disclosure.isOpen, disclosure.close);

  return disclosure;
}
