import { createContext, useContext } from "react";

const initialState: IDashboardDrawerContext = {
  isAutoDrawer: false,
  isDrawerOpen: false,
  clientWidth: null,
  close: () => {},
  open: () => {},
  toggle: () => {},
  auto: () => {},
  manual: () => {},
};

export interface IDashboardDrawerContext {
  isAutoDrawer: boolean;
  isDrawerOpen: boolean;
  clientWidth: number | null;
  close: () => void;
  open: () => void;
  toggle: () => void;
  auto: () => void;
  manual: () => void;
}

export const DashboardDrawerContext = createContext(initialState);

export const useDashboardDrawer = (): IDashboardDrawerContext => {
  const ctx = useContext(DashboardDrawerContext);

  if (!ctx) throw new Error("useDashboardDrawer must be inside DashboardDrawerProvider");

  return ctx;
};
