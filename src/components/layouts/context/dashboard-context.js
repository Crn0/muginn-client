import { createContext, useContext } from "react";

export const DashboardDrawerContext = createContext(null);

export const useDashboardDrawer = () => {
  const ctx = useContext(DashboardDrawerContext);

  if (!ctx) throw new Error("useDashboardDrawer must be inside DashboardDrawerProvider");

  return ctx;
};
