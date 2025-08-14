import { useCallback, useMemo, useState } from "react";

export type TDisclosure = ReturnType<typeof useDisclosure>;

export const useDisclosure = (initial = false) => {
  const [isOpen, setIsOpen] = useState(initial);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((state) => !state), []);

  const state = useMemo(() => ({ isOpen, open, close, toggle }), [close, isOpen, open, toggle]);

  return state;
};
