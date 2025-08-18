import { createContext, useContext } from "react";

export const DropDownMenuProvider = createContext({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
  hide: () => {},
  reset: () => {},
});

export const useDropDownMenu = () => {
  const ctx = useContext(DropDownMenuProvider);

  if (!ctx) throw new Error("useDropDownMenu must be inside DropDownMenuProvider");

  return ctx;
};
