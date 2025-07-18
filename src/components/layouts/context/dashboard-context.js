import { createContext, useContext } from "react";

export const DashboardDrawerContext = createContext({
  isAutoDrawer: false,
  isDrawerOpen: false,
  clientWidth: null,
  close: () => {},
  open: () => {},
  toggle: () => {},
  auto: () => {},
  manual: () => {},
});

export const useDashboardDrawer = () => {
  const ctx = useContext(DashboardDrawerContext);

  if (!ctx) throw new Error("useDashboardDrawer must be inside DashboardDrawerProvider");

  return ctx;
};
